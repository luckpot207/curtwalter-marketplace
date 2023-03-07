const footerNavigation = {
  account: [
    { name: "Manage Account", href: "#" },
    { name: "Saved Items", href: "#" },
    { name: "Orders", href: "#" },
    { name: "Redeem Gift card", href: "#" },
  ],
  service: [
    { name: "Shipping & Returns", href: "#" },
    { name: "Warranty", href: "#" },
    { name: "FAQ", href: "#" },
    { name: "Find a store", href: "#" },
    { name: "Get in touch", href: "#" },
  ],
  company: [
    { name: "Who we are", href: "#" },
    { name: "Press", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Terms & Conditions", href: "#" },
    { name: "Privacy", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer aria-labelledby="footer-heading" className="bg-white">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="border-t border-gray-200 py-20 grid grid-cols-2 gap-8 sm:gap-y-0 sm:grid-cols-2 lg:grid-cols-4">
          <div className="grid grid-cols-1 gap-y-10 lg:col-span-2 lg:grid-cols-2 lg:gap-y-0 lg:gap-x-8">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Account</h3>
              <ul role="list" className="mt-6 space-y-6">
                {footerNavigation.account.map((item) => (
                  <li key={item.name} className="text-sm">
                    <a
                      href={item.href}
                      className="text-gray-500 hover:text-gray-600"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Service</h3>
              <ul role="list" className="mt-6 space-y-6">
                {footerNavigation.service.map((item) => (
                  <li key={item.name} className="text-sm">
                    <a
                      href={item.href}
                      className="text-gray-500 hover:text-gray-600"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-y-10 lg:col-span-2 lg:grid-cols-2 lg:gap-y-0 lg:gap-x-8">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Company</h3>
              <ul role="list" className="mt-6 space-y-6">
                {footerNavigation.company.map((item) => (
                  <li key={item.name} className="text-sm">
                    <a
                      href={item.href}
                      className="text-gray-500 hover:text-gray-600"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 py-10 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center justify-center text-sm text-gray-500">
            <p>Shipping to Canada ($CAD)</p>
            <p className="ml-3 border-l border-gray-200 pl-3">English</p>
          </div>
          <p className="mt-6 text-sm text-gray-500 text-center sm:mt-0">
            &copy; 2021 Clothing Company, Ltd.
          </p>
        </div>
      </div>
    </footer>
  );
}
