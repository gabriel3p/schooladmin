
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    if (all) {
      select(el, all).forEach(e => e.addEventListener(type, listener))
    } else {
      select(el, all).addEventListener(type, listener)
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Sidebar toggle
   */
  if (select('.toggle-sidebar-btn')) {
    on('click', '.toggle-sidebar-btn', function(e) {
      select('body').classList.toggle('toggle-sidebar')
    })
  }

  /**
   * Search bar toggle
   */
  if (select('.search-bar-toggle')) {
    on('click', '.search-bar-toggle', function(e) {
      select('.search-bar').classList.toggle('search-bar-show')
    })
  }

  /**
   * Navbar links active state on scroll
  
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)
 */

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Initiate tooltips
   */
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })

  /**
   * Initiate Bootstrap validation check
   */
  var needsValidation = document.querySelectorAll('.needs-validation')

  Array.prototype.slice.call(needsValidation)
    .forEach(function(form) {
      form.addEventListener('submit', function(event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })

  /**
   * Initiate Datatables
   */
  const datatables = select('.datatable', true)
  datatables.forEach(datatable => {
    new simpleDatatables.DataTable(datatable);
  })

  /**
   * Autoresize echart charts
   */
  const mainContainer = select('#main');
  if (mainContainer) {
    setTimeout(() => {
      new ResizeObserver(function() {
        select('.echart', true).forEach(getEchart => {
          echarts.getInstanceByDom(getEchart).resize();
        })
      }).observe(mainContainer);
    }, 200);
  }

  function refeshPageTitle () {
    let h1El = document.querySelector('.pagetitle h1');

    if (h1El) return document.title = h1El.innerHTML;
    
  }

  window.addEventListener('load', refeshPageTitle);


  /**
   * Marcar todas as inputs:checkbox
   */

  document.querySelectorAll('form').forEach(formEl => {
    const elements = [...formEl.elements].map(item => {
      if (item.name == 'todos') return item
    });

    elements.forEach(inputTodos => {
      if (inputTodos) {
        inputTodos.addEventListener('click', () => {
          if (inputTodos.checked) {
            [...formEl.elements].forEach(element => {
              if (element.type == 'checkbox') {
                element.checked = true;
              }
            });
          } else {
            [...formEl.elements].forEach(element => {
              if (element.type == 'checkbox') {
                element.checked = false;
              }
            });
          }
        });
        
      }
    });
  });


  /**
   * Collapsed Menu
   */
  const navlinks = document.querySelectorAll('#sidebar-nav .nav-link');
  const href = window.location.href.split('/');
  


  navlinks.forEach(navlink => {
    let span = (!navlink.children[1].children[0]) ? navlink.children[1].innerHTML : navlink.children[1].children[0].innerHTML;
    navlink.classList.add('collapsed')

    if (href.includes(span.toLocaleLowerCase())) {
      navlink.classList.remove('collapsed')
    } else {
      if (href[href.length - 1].split('?').includes(span.toLocaleLowerCase()))
        navlink.classList.remove('collapsed')
    }
  });


  /* SCRIPT DE IMPRESSÃO */
  const printBtn = document.querySelector('.print-btn');
  const page = document.getElementById('page');

  function printDocument (btn) {
    if (btn && page) {
      btn.addEventListener('click', () => {
        window.print()
      });
    }
  }

  printDocument(printBtn);


})();