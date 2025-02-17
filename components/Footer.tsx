export default function Footer() {
  return (
    <footer className="mt-auto text-center text-[12px] opacity-80 text-gray-500 border-t py-4 hidden md:block">
      Developed by{" "}
      <a href="https://rawcomposition.com" target="_blank">
        RawComposition
      </a>
      <span className="mx-2">•</span>
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSc16gkzUiRR5FNy4y2GdpK7nO5cOZtY9iawWPuLTrwMkbnJDA/viewform"
        target="_blank"
      >
        Feedback
      </a>
      <span className="mx-2">•</span>
      <a href="https://github.com/rawcomposition/bird-planner" target="_blank">
        Github
      </a>
    </footer>
  );
}
