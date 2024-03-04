/**
 * v0 by Vercel.
 * @see https://v0.dev/t/3sM1nk3LnSA
 */
export default function Component() {
    return (
      <div className="flex flex-col">
        <header />
        <main className="flex-grow" />
        <footer className="p-4 text-white">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <p className="text-lg font-bold">GenX.Wherever</p>
              <p className="text-sm">Unlock the world of cryptocurrency trading.</p>
            </div>
            <nav className="flex space-x-4">
              <a className="hover:underline" href="#">
                Mets
              </a>
              <a className="hover:underline" href="#">
                Ce Que
              </a>
              <a className="hover:underline" href="#">
                Tu
              </a>
              <a className="hover:underline" href="#">
                Veux
              </a>
            </nav>
          </div>
        </footer>
      </div>
    )
  }
  