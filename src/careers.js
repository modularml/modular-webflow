// Career Listing
// if location host is modular-dev.webflow.io, add class .webflow-page-type-career-post to body
if (window.location.host === 'modular-dev.webflow.io') {
  var greenhouse = 'modtestingsite';
} else {
  greenhouse = 'modularai';
}

var hostName = window.location.hostname;

// get jobs for department with id 4001072005
function getJobsForDepartment(jobPositions, departmentId) {
  let jobsForDepartment = [];
  for (let i = 0; i < jobPositions.departments.length; i++) {
    if (jobPositions.departments[i].id === departmentId) {
      jobsForDepartment = jobPositions.departments[i].jobs;
    }
  }
  return jobsForDepartment;
}

// for each job in jobsForDepartment append a job to the element with class .greenhouse-tabs-content
function appendJobsForDepartment(jobsForDepartment) {
  document.querySelector('.roles-list_item').innerHTML = '';
  for (let i = 0; i < jobsForDepartment.length; i++) {
    let job = jobsForDepartment[i];
    let jobTitle = job.title;
    let jobId = job.id;
    let jobLocation = job.location.name;

    let listItem = document.createElement('li');

    let jobListItem = document.createElement('a');
    jobListItem.classList.add('roles-list_link');
    jobListItem.setAttribute(
      'href',
      `https://${hostName}/company/career-post?${jobId}&gh_jid=${jobId}`
    );
    jobListItem.setAttribute('data-job-id', jobId);
    jobListItem.innerHTML = `<div class="z-index-2"><div class="margin-bottom margin-4"><p class="text-size-small text-weight-medium text-style-tthoves">${jobTitle}</p></div><div class="text-color-twilight60"><p class="text-size-xsmall">${jobLocation}</p></div></div> <div class="text-color-twilight60 z-index-2"><div><p class="text-size-xsmall">Apply now</p></div></div><div class="roles-list_link-bg"></div>`;

    listItem.appendChild(jobListItem);
    document.querySelector('.roles-list_item').appendChild(listItem);
  }
}

if (document.querySelector('.roles_wrap')) {
  async function fetchData() {
    const jobsResponse = await fetch(
      `https://boards-api.greenhouse.io/v1/boards/${greenhouse}/jobs`
    );
    const jobsData = await jobsResponse.json();

    function appendAllJobs(jobs) {
      const tabsMenu = document.querySelector('.roles_wrap .roles-filters');
      tabsMenu.innerHTML = '';

      const listItem = document.createElement('li');

      const departmentListItem = document.createElement('a');
      departmentListItem.classList.add('tabs-item');
      departmentListItem.href = '#';
      departmentListItem.innerHTML = `
                <div>All</div>
                <div>(${jobs.length})</div>`;

      $(departmentListItem).on('click', function (e) {
        $('.is-active').removeClass('is-active');
        $(this).addClass('is-active');

        appendJobsForDepartment(jobs);
      });

      listItem.appendChild(departmentListItem);
      tabsMenu.appendChild(listItem);
    }
    appendAllJobs(jobsData.jobs);

    const departmentsResponse = await fetch(
      `https://boards-api.greenhouse.io/v1/boards/${greenhouse}/departments`
    );
    const departmentsData = await departmentsResponse.json();

    var jobPositions = departmentsData;

    function findDepartmentsWithJobs(jobPositions) {
      let departmentsWithJobs = [];

      for (let i = 0; i < jobPositions.departments.length; i++) {
        if (jobPositions.departments[i].jobs.length > 0) {
          departmentsWithJobs.push(jobPositions.departments[i]);
        }
      }

      return departmentsWithJobs;
    }

    var departmentsWithJobs = findDepartmentsWithJobs(jobPositions);

    function appendDepartmentsWithJobs(departmentsWithJobs) {
      const tabsMenu = document.querySelector('.roles_wrap .roles-filters');

      departmentsWithJobs.forEach((department) => {
        const { id: departmentId, name: departmentName, jobs } = department;

        const listItem = document.createElement('li');

        const departmentListItem = document.createElement('a');

        departmentListItem.classList.add('tabs-item');
        departmentListItem.dataset.departmentId = departmentId;
        departmentListItem.href = '#';
        departmentListItem.innerHTML = `
                        <div>${departmentName}</div>
                        <div>(${jobs.length})</div>
                    `;

        departmentListItem.addEventListener('click', (e) => {
          const currentTab = document.querySelector('.is-active');
          if (currentTab) currentTab.classList.remove('is-active');

          const targetLink = e.currentTarget.closest('a') || e.currentTarget.querySelector('a');
          if (targetLink) targetLink.classList.add('is-active');

          const jobsForDepartment = getJobsForDepartment(jobPositions, departmentId);
          appendJobsForDepartment(jobsForDepartment);
        });

        listItem.appendChild(departmentListItem);
        tabsMenu.appendChild(listItem);
      });
    }

    appendDepartmentsWithJobs(departmentsWithJobs);

    document.querySelector('.roles-filters').querySelectorAll('.tabs-item')[0].click();
  }

  fetchData();
}

// Career Detail
if (window.location.pathname === '/company/career-post') {
  if (window.location.host === 'modular-dev.webflow.io') {
    var greenhouse = 'modtestingsite';
  } else {
    greenhouse = 'modularai';
  }

  var greenhouseSrc = `https://boards.greenhouse.io/embed/job_board/js?for=${greenhouse}`;
  var greenhouseScript = document.createElement('script');
  greenhouseScript.src = greenhouseSrc;
  document.body.appendChild(greenhouseScript);

  var jobId = window.location.search.split('=')[1];
  fetch(`https://boards-api.greenhouse.io/v1/boards/${greenhouse}/jobs/${jobId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 404) {
        window.location.href = '/company/careers';
        return;
      }
      let job = data;
      let jobTitle = job.title;
      let jobLocation = job.location.name;
      document.getElementById('job-title').innerHTML = jobTitle;
      document.getElementById('job-location').innerHTML = jobLocation;
      document.getElementById('job-breadcrumb').innerHTML = jobTitle;
    });

  document.getElementById('job-image').src = images[randomImage - 1];
}
