export default function Footer() {
  return (
    <>
      <footer className="bg-gray-800 text-white text-lg text-center py-4 font-semibold">
        <h3>Developed By Ahmed Ekramy</h3>
        <p>
          <a
            href="https://github.com/AhmedEkramy24"
            target="_blank"
            className="text-blue-400 hover:text-blue-600"
          >
            <i className="fa-brands fa-github me-2"></i>
            Visit My GitHub
          </a>
        </p>
        <p>© {new Date().getFullYear()} Linked Posts</p>
      </footer>
    </>
  );
}
