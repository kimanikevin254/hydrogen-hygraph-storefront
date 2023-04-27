export function Layout({children, title}) {
    return (
      <div className="flex flex-col min-h-screen">
        <header
          role="banner"
          className="flex items-center justify-between w-full h-16 p-6 sticky top-0 gap-4 shadow-sm"
        >
          <div className="flex gap-8">
            <a className="font-bold" href="/">
              {title}
            </a>
          </div>
        </header>
  
        <main
          role="main"
          id="mainContent"
          className="flex-grow p-6"
        >
          {children}
        </main>
      </div>
    );
  }