const slider2 = document.getElementById("glide_02");

  /*
  SLIDE CURSOS
  */
  if (slider2) {
    new Glide(slider2, {
      type: "carousel",
      startAt: 0,
      hoverpause: true,
      perView: 3,
      animationDuration: 800,
      animationTimingFunc: "linear",
      breakpoints: {
        992: {
          perView: 2,
        },
        768: {
          perView: 1,
        }
      }
    }).mount();
  }


 