export default function Footer() {
  return (
    <footer className="relative bg-gray-900 border-t border-gray-800 mt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">D</span>
              </div>
              <span className="text-xl font-bold text-white">DeFutures</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-sm">
              The future of prediction markets. Trade your insights on crypto, sports, and world events.
            </p>
            
              href="https://x.com/DeFuturesx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            >
              <span className="text-xl">X</span>
              <span>Follow DeFuturesx</span>
            </a>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Markets
                </a>
              </li>
              <li>
                <a href="/admin" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Admin
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Network</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Fluent Testnet</li>
              <li className="text-gray-400">Chain ID: 20994</li>
              <li>
                
                  href="https://testnet.fluentscan.xyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Block Explorer
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            2024 DeFutures. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Built on Fluent Testnet
          </p>
        </div>
      </div>
    </footer>
  );
}