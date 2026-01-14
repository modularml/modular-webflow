if (window.location.host === 'modular-rebuild.webflow.io') {
  var url = 'https://api.gem.com/job_board/v0/modular/job_posts/';
} else {
  url = 'https://boards-api.greenhouse.io/v1/boards/modularai/jobs';
}

var hostName = window.location.hostname;

function getJobsForDepartment(jobs, departmentId) {
  return jobs.filter((job) => {
    return job.departments && job.departments.length > 0 && job.departments[0].id === departmentId;
  });
}

function appendJobs(jobs) {
  const container = $('.roles-list_item');
  container.html('');

  jobs.forEach((job) => {
    const jobTitle = job.title;
    const jobId = job.id;
    const jobLocation = job.location.name || 'Remote';

    const listItem = $('<li>');
    const jobLink = $('<a>')
      .addClass('roles-list_link')
      .attr('href', `https://${hostName}/company/career-post?${jobId}&gh_jid=${jobId}`)
      .attr('data-job-id', jobId).html(`
        <div class="z-index-2">
          <div class="margin-bottom margin-4">
            <p class="text-size-small text-weight-medium text-style-tthoves">${jobTitle}</p>
          </div>
          <div class="text-color-twilight60">
            <p class="text-size-small">${jobLocation}</p>
          </div>
        </div>
        <div class="text-color-twilight60 z-index-2">
          <div><p class="text-size-small">Apply now</p></div>
        </div>
        <div class="roles-list_link-bg"></div>
      `);

    listItem.append(jobLink);
    container.append(listItem);
  });
}

if ($('.roles_wrap').length) {
  async function fetchData() {
    const response = await fetch(url);
    const jobs = await response.json();
    console.log(jobs);

    const tabsMenu = $('.roles_wrap .roles-filters');
    tabsMenu.html('');

    const allTab = $('<li>').append(
      $('<a>')
        .addClass('tabs-item')
        .attr('href', '#')
        .html(`<div>All</div><div>(${jobs.length})</div>`)
        .on('click', function (e) {
          e.preventDefault();
          $('.tabs-item').removeClass('is-active');
          $(this).addClass('is-active');
          appendJobs(jobs);
        })
    );
    tabsMenu.append(allTab);

    const departmentMap = new Map();

    jobs.forEach((job) => {
      if (job.departments && job.departments.length > 0) {
        const dept = job.departments[0];
        if (!departmentMap.has(dept.id)) {
          departmentMap.set(dept.id, {
            id: dept.id,
            name: dept.name,
            jobs: [],
          });
        }
        departmentMap.get(dept.id).jobs.push(job);
      }
    });

    departmentMap.forEach((department) => {
      const deptTab = $('<li>').append(
        $('<a>')
          .addClass('tabs-item')
          .attr('href', '#')
          .attr('data-department-id', department.id)
          .html(`<div>${department.name}</div><div>(${department.jobs.length})</div>`)
          .on('click', function (e) {
            e.preventDefault();
            $('.tabs-item').removeClass('is-active');
            $(this).addClass('is-active');
            appendJobs(department.jobs);
          })
      );
      tabsMenu.append(deptTab);
    });

    $('.tabs-item').first().trigger('click');
  }

  fetchData();
}

if (window.location.pathname === '/company/career-post') {
  const jobId = window.location.search.split('=')[1];

  fetch(url)
    .then((response) => response.json())
    .then((jobs) => {
      const job = jobs.find((j) => j.id.toString() === jobId);

      if (!job) {
        window.location.href = '/company/careers';
        return;
      }

      const jobTitle = job.title;
      const jobLocation = job.location.name || 'Remote';
      const applyUrl = job.absolute_url;

      $('#job-title').html(jobTitle);
      $('#job-location').html(jobLocation);
      $('#job-breadcrumb').html(jobTitle);

      const iframe = $('<iframe>')
        .attr({
          src: applyUrl,
          width: '100%',
          frameborder: '0',
          scrolling: 'no',
        })
        .css({
          minHeight: '100vh',
          display: 'block',
        });

      $('#grnhse_app').html(iframe);

      window.addEventListener('message', function (e) {
        if (e.data.height) {
          iframe.css('height', e.data.height + 50 + 'px');
        }
      });

      iframe.on('load', function () {
        const checkHeight = setInterval(function () {
          try {
            const iframeDoc = iframe[0].contentDocument || iframe[0].contentWindow.document;
            const height = $(iframeDoc).find('body').outerHeight();
            if (height > 0) {
              iframe.css('height', height + 50 + 'px');
            }
          } catch (e) {
            clearInterval(checkHeight);
          }
        }, 500);

        setTimeout(() => clearInterval(checkHeight), 5000);
      });

      $('.main-wrapper').css('opacity', '1');
    })
    .catch((error) => {
      console.error('Error fetching job:', error);
      window.location.href = '/company/careers';
    });
}
