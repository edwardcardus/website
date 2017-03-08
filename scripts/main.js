(function() {
  var polyFills = {
    requestAnimationFrame: function(callback) {
      if (window.requestAnimationFrame) {
        return requestAnimationFrame(callback);
      } else {
        return setTimeout(callback, 60 / 1000);
      }
    },
    cancelAnimationFrame: function(requestID) {
      if (window.cancelAnimationFrame) {
        cancelAnimationFrame(requestID);
      } else {
        clearTimeout(requestID);
      }
    },
    classListAdd: function(element, className) {
      if (element.classList) {
        element.classList.add(className);
      } else {
        polyFills.classListRemove(element, className);

        var classList = element.className.split(" ");
        classList.push(className);

        element.className = classList.join(" ");
      }
    },
    classListRemove: function(element, className) {
      if (element.classList) {
        element.classList.remove(className);
      } else {
        var classList = element.className.split(" ").filter(function(cn) {
          return cn != className;
        });

        element.className = classList.join(" ");
      }
    },
    classListToggle: function(element, className) {
      if (element.classList) {
        element.classList.toggle(className);
      } else {
        var classList = element.className.split(" ").filter(function(cn) {
          return cn == className;
        });

        if (classList.length == 0) {
          polyFills.classListAdd(element, className);
        } else {
          polyFills.classListRemove(element, className);
        }
      }
    }
  }

  var anchorsController = function () {
    var scrollStart;
    var scrollDistance;
    var animateIteration;
    var animateIterationRequest;

    this.initialise = function () {
      var anchors = document.querySelectorAll("a[href^='#']");

      for (var index = 0; index < anchors.length; index++) {
        anchors[index].addEventListener("click", function (event) {
          closeMenu();
          initialiseAnimation(event);
        });
      }
    }

    var closeMenu = function () {
        polyFills.classListRemove(document.querySelector("#hamburger"), "active");
        polyFills.classListRemove(document.querySelector("#menu"), "active");
    }

    var initialiseAnimation = function (event) {
      event.preventDefault();

      polyFills.cancelAnimationFrame(animateIterationRequest);

      scrollStart = window.pageYOffset;

      if (scrollStart + document.querySelector(event.target.getAttribute("href")).getBoundingClientRect().top - document.querySelector("header").getBoundingClientRect().height <= document.documentElement.scrollHeight - window.innerHeight) {
        scrollDistance = document.querySelector(event.target.getAttribute("href")).getBoundingClientRect().top - document.querySelector("header").getBoundingClientRect().height;
      } else {
        scrollDistance = document.documentElement.scrollHeight - window.innerHeight - window.pageYOffset;
      }

      animateIteration = 0;

      animate();
    }

    var animate = function () {
      animateIteration++;

      var distance = scrollDistance - (scrollDistance * Math.pow(0.9, animateIteration));

      if (distance < scrollDistance - 1 || distance > scrollDistance + 1) {
        window.scrollTo(window.pageXOffset, scrollStart + distance);

        animateIterationRequest = polyFills.requestAnimationFrame(animate);
      } else {
        window.scrollTo(window.pageXOffset, scrollStart + scrollDistance);
      }
    }

    this.initialise();
  }

  var menuController = function () {
    this.initialise = function () {
      document.querySelector("#hamburger").addEventListener("click", function () {
        toggleMenu();
      });
    }

    var toggleMenu = function () {
        polyFills.classListToggle(document.querySelector("#hamburger"), "active");
        polyFills.classListToggle(document.querySelector("#menu"), "active");
    }

    this.initialise();
  }

  document.addEventListener("DOMContentLoaded", function () {
    var anchors = new anchorsController();
    var menu = new menuController();
  });
})();
