import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="回到頂端"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`press fixed bottom-6 left-6 z-40 grid size-11 place-items-center rounded-full border border-primary/40 bg-background/85 text-primary backdrop-blur-md transition-all duration-300 hover:bg-primary/10 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp className="size-4" />
    </button>
  );
}
