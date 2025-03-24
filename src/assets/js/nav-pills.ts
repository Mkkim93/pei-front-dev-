/* eslint-disable */

export default function setNavPills() {
  const total = document.querySelectorAll<HTMLElement>(".nav-pills");

  function initNavs() {
    total.forEach((item) => {
      const moving_div = document.createElement("div");
      const first_li = item.querySelector("li:first-child .nav-link") as HTMLElement;
      const tab = first_li.cloneNode() as HTMLElement;
      tab.innerHTML = "-";

      moving_div.classList.add("moving-tab", "position-absolute", "nav-link");
      moving_div.appendChild(tab);
      item.appendChild(moving_div);

      moving_div.style.padding = "0px";
      moving_div.style.width = (item.querySelector("li:nth-child(1)") as HTMLElement).offsetWidth + "px";
      moving_div.style.transform = "translate3d(0px, 0px, 0px)";
      moving_div.style.transition = ".5s ease";

      item.onmouseover = function (event) {
        const target = getEventTarget(event);
        const li = target.closest("li");
        if (li) {
          const nodes = Array.from(li.closest("ul")!.children);
          const index = nodes.indexOf(li) + 1;
          const navLink = item.querySelector(`li:nth-child(${index}) .nav-link`) as HTMLElement;

          navLink.onclick = () => {
            let sum = 0;
            if (item.classList.contains("flex-column")) {
              for (let j = 1; j <= nodes.indexOf(li); j++) {
                sum += (item.querySelector(`li:nth-child(${j})`) as HTMLElement).offsetHeight;
              }
              moving_div.style.transform = `translate3d(0px, ${sum}px, 0px)`;
              moving_div.style.height = (item.querySelector(`li:nth-child(${index})`) as HTMLElement).offsetHeight + "px";
            } else {
              for (let j = 1; j <= nodes.indexOf(li); j++) {
                sum += (item.querySelector(`li:nth-child(${j})`) as HTMLElement).offsetWidth;
              }
              moving_div.style.transform = `translate3d(${sum}px, 0px, 0px)`;
              moving_div.style.width = (item.querySelector(`li:nth-child(${index})`) as HTMLElement).offsetWidth + "px";
            }
          };
        }
      };
    });
  }

  setTimeout(() => {
    initNavs();
  }, 100);

  window.addEventListener("resize", () => {
    total.forEach((item) => {
      item.querySelector(".moving-tab")?.remove();
      const moving_div = document.createElement("div");
      const tab = (item.querySelector(".nav-link.active") as HTMLElement).cloneNode() as HTMLElement;
      tab.innerHTML = "-";

      moving_div.classList.add("moving-tab", "position-absolute", "nav-link");
      moving_div.appendChild(tab);
      item.appendChild(moving_div);

      moving_div.style.padding = "0px";
      moving_div.style.transition = ".5s ease";

      const li = (item.querySelector(".nav-link.active") as HTMLElement).parentElement!;
      const nodes = Array.from(li.closest("ul")!.children);
      const index = nodes.indexOf(li) + 1;

      let sum = 0;

      if (item.classList.contains("flex-column")) {
        for (let j = 1; j <= nodes.indexOf(li); j++) {
          sum += (item.querySelector(`li:nth-child(${j})`) as HTMLElement).offsetHeight;
        }
        moving_div.style.transform = `translate3d(0px, ${sum}px, 0px)`;
        moving_div.style.width = (item.querySelector(`li:nth-child(${index})`) as HTMLElement).offsetWidth + "px";
        moving_div.style.height = (item.querySelector(`li:nth-child(${index})`) as HTMLElement).offsetHeight + "px";
      } else {
        for (let j = 1; j <= nodes.indexOf(li); j++) {
          sum += (item.querySelector(`li:nth-child(${j})`) as HTMLElement).offsetWidth;
        }
        moving_div.style.transform = `translate3d(${sum}px, 0px, 0px)`;
        moving_div.style.width = (item.querySelector(`li:nth-child(${index})`) as HTMLElement).offsetWidth + "px";
      }
    });
  });

  if (window.innerWidth < 991) {
    total.forEach((item) => {
      if (item.classList.contains("flex-row")) {
        item.classList.remove("flex-row");
        item.classList.add("flex-column", "on-resize");
      }
    });
  }

  function getEventTarget(e: Event): HTMLElement {
    return (e.target || e.srcElement) as HTMLElement;
  }
}
