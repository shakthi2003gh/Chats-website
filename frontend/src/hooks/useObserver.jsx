import { useEffect } from "react";

export default function useObserver(nodeList, callback, dependency) {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const node = entry.target;
        node.classList.toggle("show", entry.isIntersecting);

        if (entry.isIntersecting && typeof callback === "function")
          callback(node);
      });
    });

    const list = (typeof nodeList === "function" ? nodeList() : nodeList) || [];
    list.forEach((node) => observer.observe(node));

    return () => {
      list.forEach((node) => observer.unobserve(node));
    };
  }, dependency || []);
}
