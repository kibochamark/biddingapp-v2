"use client"
import Link from 'next/link'
import { TrendingUp, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { FooterNewsletter } from "./footer-newsletter";
import { usePathname } from 'next/navigation';

const ClientFooter = () => {
    const currentYear = new Date().getFullYear();
    const path = usePathname();

    // Do not render footer on admin pages
    if (path.startsWith("/admin")) {
        return null;
    }

    
    return (
      <footer className="shadow-md mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              {/* Main Footer Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                  {/* Brand Section */}
                  <div className="space-y-4">
                      <Link href="/" className="flex items-center space-x-2 group">
                          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                              <TrendingUp className="h-5 w-5 text-primary-foreground" />
                          </div>
                          <span className="text-lg font-bold text-foreground">BidMarket</span>
                      </Link>
                      <p className="text-sm text-muted-foreground">
                          Win amazing products through our unique lowest unique bid auction system. Fair, transparent, and exciting.
                      </p>
                      {/* Social Links */}
                      <div className="flex gap-3">
                          <a
                              href="https://facebook.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors"
                          >
                              <Facebook className="h-4 w-4" />
                          </a>
                          <a
                              href="https://twitter.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors"
                          >
                              <Twitter className="h-4 w-4" />
                          </a>
                          <a
                              href="https://instagram.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors"
                          >
                              <Instagram className="h-4 w-4" />
                          </a>
                          <a
                              href="https://linkedin.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors"
                          >
                              <Linkedin className="h-4 w-4" />
                          </a>
                      </div>
                  </div>

                  {/* Quick Links */}
                  <div>
                      <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
                      <ul className="space-y-2">
                          <li>
                              <Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                  How Bidding Works
                              </Link>
                          </li>
                          <li>
                              <Link href="/catalog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                  Browse Auctions
                              </Link>
                          </li>
                          <li>
                              <Link href="/catalog?filter=ending-soon" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                  Ending Soon
                              </Link>
                          </li>
                          <li>
                              <Link href="/profile" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                  My Account
                              </Link>
                          </li>
                      </ul>
                  </div>

                  {/* Support */}
                  <div>
                      <h3 className="font-semibold text-foreground mb-4">Support</h3>
                      <ul className="space-y-2">
                          <li>
                              <Link href="/shipping-returns" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                  Shipping & Returns
                              </Link>
                          </li>
                          <li>
                              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                  Terms of Service
                              </Link>
                          </li>
                          <li>
                              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                  Privacy Policy
                              </Link>
                          </li>
                          <li>
                              <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                  Cookie Policy
                              </Link>
                          </li>
                      </ul>
                  </div>

                  {/* Newsletter */}
                  <div>
                      <h3 className="font-semibold text-foreground mb-4">Stay Updated</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                          Subscribe to get notifications about new auctions and exclusive deals.
                      </p>
                      <FooterNewsletter />
                  </div>
              </div>

              {/* Contact Info */}
              <div className="border-t border-border pt-8 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                              <Mail className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                              <p className="text-xs text-muted-foreground">Email</p>
                              <a href="mailto:support@bidmarket.com" className="text-sm text-foreground hover:text-primary">
                                  support@bidmarket.com
                              </a>
                          </div>
                      </div>
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                              <Phone className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                              <p className="text-xs text-muted-foreground">Phone</p>
                              <a href="tel:+1234567890" className="text-sm text-foreground hover:text-primary">
                                  +1 (234) 567-890
                              </a>
                          </div>
                      </div>
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                              <MapPin className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                              <p className="text-xs text-muted-foreground">Address</p>
                              <p className="text-sm text-foreground">123 Auction St, NY 10001</p>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Bottom Bar */}
              <div className="border-t border-border pt-6">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      <p className="text-sm text-muted-foreground">
                          © {currentYear} BidMarket. All rights reserved.
                      </p>
                      <div className="flex gap-6">
                          <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                              Terms
                          </Link>
                          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                              Privacy
                          </Link>
                          <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                              Cookies
                          </Link>
                      </div>
                  </div>
              </div>
          </div>
      </footer>
  )
}

export default ClientFooter