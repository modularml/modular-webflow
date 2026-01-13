export function initCookie() {
  const EU_TIMEZONES = [
    'Europe/Vienna',
    'Europe/Brussels',
    'Europe/Sofia',
    'Europe/Zagreb',
    'Asia/Famagusta',
    'Asia/Nicosia',
    'Europe/Prague',
    'Europe/Copenhagen',
    'Europe/Tallinn',
    'Europe/Helsinki',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Busingen',
    'Europe/Athens',
    'Europe/Budapest',
    'Europe/Dublin',
    'Europe/Rome',
    'Europe/Riga',
    'Europe/Vilnius',
    'Europe/Luxembourg',
    'Europe/Malta',
    'Europe/Amsterdam',
    'Europe/Warsaw',
    'Atlantic/Azores',
    'Atlantic/Madeira',
    'Europe/Lisbon',
    'Europe/Bucharest',
    'Europe/Bratislava',
    'Europe/Ljubljana',
    'Africa/Ceuta',
    'Atlantic/Canary',
    'Europe/Madrid',
    'Europe/Stockholm',
  ];
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (!EU_TIMEZONES.includes(timezone)) {
    return;
  }
  // obtain plugin
  var cc = initCookieConsent();

  // run plugin with your configuration
  cc.run({
    current_lang: 'en',
    autoclear_cookies: true, // default: false
    page_scripts: true, // default: false

    // mode: 'opt-in'                          // default: 'opt-in'; value: 'opt-in' or 'opt-out'
    // delay: 0,                               // default: 0
    // auto_language: null                     // default: null; could also be 'browser' or 'document'
    // autorun: true,                          // default: true
    // force_consent: false,                   // default: false
    // hide_from_bots: true,                   // default: true
    // remove_cookie_tables: false             // default: false
    // cookie_name: 'cc_cookie',               // default: 'cc_cookie'
    // cookie_expiration: 182,                 // default: 182 (days)
    // cookie_necessary_only_expiration: 182   // default: disabled
    // cookie_domain: location.hostname,       // default: current domain
    // cookie_path: '/',                       // default: root
    // cookie_same_site: 'Lax',                // default: 'Lax'
    // use_rfc_cookie: false,                  // default: false
    // revision: 0,                            // default: 0

    onFirstAction: function (user_preferences, cookie) {
      // callback triggered only once
    },

    onAccept: function (cookie) {
      // ...
    },

    onChange: function (cookie, changed_preferences) {
      // ...
    },

    languages: {
      en: {
        consent_modal: {
          title: 'Please accept our cookies',
          description:
            'We use cookies to track visitor traffic so we can learn to improve the website and documentation. <a aria-label="Cookie policy" class="cc-link" data-cc="c-settings">Read more</a>',
          primary_btn: {
            text: 'Accept',
            role: 'accept_all', // 'accept_selected' or 'accept_all'
          },
          secondary_btn: {
            text: 'Reject',
            role: 'accept_necessary', // 'settings' or 'accept_necessary'
          },
        },
        settings_modal: {
          title: 'Cookie preferences',
          save_settings_btn: 'Save settings',
          accept_all_btn: 'Accept all',
          reject_all_btn: 'Reject all',
          close_btn_label: 'Close',
          cookie_table_headers: [
            { col1: 'Name' },
            { col2: 'Domain' },
            { col3: 'Expiration' },
            { col4: 'Description' },
          ],
          blocks: [
            {
              title: 'Cookie usage',
              description:
                'The Modular Docs website uses browser cookies only to track website traffic with Google Analytics. For more details about how we handle sensitive data, please read our <a href="https://www.modular.com/privacy" class="cc-link">privacy policy</a>.',
            },
            {
              title: 'Google Analytics cookies',
              description: 'These cookies track website usage and are unique to this website.',
              toggle: {
                value: 'analytics', // your cookie category
                enabled: false,
                readonly: false,
              },
              cookie_table: [
                // list of all expected cookies
                {
                  col1: '^_ga', // match all cookies starting with "_ga"
                  col2: 'google.com',
                  col3: '2 years',
                  col4: 'Google Analytics',
                  is_regex: true,
                },
              ],
            } /*, {
                          title: 'Strictly necessary cookies',
                          description: 'These cookies are essential for the proper functioning of my website. Without these cookies, the website would not work properly',
                          toggle: {
                              value: 'necessary',
                              enabled: true,
                              readonly: true          // cookie categories with readonly=true are all treated as "necessary cookies"
                          }
                      }, {
                          title: 'Advertisement and Targeting cookies',
                          description: 'These cookies collect information about how you use the website, which pages you visited and which links you clicked on. All of the data is anonymized and cannot be used to identify you',
                          toggle: {
                              value: 'targeting',
                              enabled: false,
                              readonly: false
                          }
                      }, {
                          title: 'More information',
                          description: 'For any queries in relation to our policy on cookies and your choices, please <a class="cc-link" href="#yourcontactpage">contact us</a>.',
                      } */,
          ],
        },
      },
    },
  });
}
