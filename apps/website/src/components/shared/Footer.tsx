import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Youtube, Instagram, Linkedin, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-200">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 py-12 lg:py-16">
          {/* Logo & Description Section */}
          <div className="space-y-6 col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <Image
                src="/logodark.png"
                alt="Skill শিখো Logo"
                width={100}
                height={100}
                className="brightness-0 invert"
              />
            </div>
            <p className="text-gray-400 leading-relaxed max-w-xs">
              জ্ঞানই আমাদের জীবনকে আলোকিত করে। শিখুন, বাড়ুন এবং সফল হন।
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4 pt-2">
              <Link
                href="https://www.facebook.com/SkillShikho.it"
                target="_blank"
                className="w-10 h-10 rounded-full bg-slate-700 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </Link>
              <Link
                href="https://www.youtube.com/SkillShikhoAcademy"
                target="_blank"
                className="w-10 h-10 rounded-full bg-slate-700 hover:bg-red-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </Link>
              <Link
                href="https://www.instagram.com/SkillShikho.it"
                target="_blank"
                className="w-10 h-10 rounded-full bg-slate-700 hover:bg-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-slate-700 hover:bg-blue-500 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </Link>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-3">
              দ্রুত লিংক
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                >
                  আমাদের সম্পর্কে
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                >
                  ক্যারিয়ার
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                >
                  স্কিলস
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                >
                  টিচার পোর্টাল
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-3">
              যোগাযোগ
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="tel:+8801632344220"
                  className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors duration-200 group"
                >
                  <Phone size={18} className="mt-1 text-blue-400 group-hover:text-blue-300" />
                  <div>
                    <span className="block text-sm">আমাদের কল করুন</span>
                    <span className="text-xs text-gray-500">+880 1632-344220</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:info.skillshikho@gmail.com"
                  className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors duration-200 group"
                >
                  <Mail size={18} className="mt-1 text-green-400 group-hover:text-green-300" />
                  <div>
                    <span className="block text-sm">আমাদের মেইল করুন</span>
                    <span className="text-xs text-gray-500">info.skillshikho@gmail.com</span>
                  </div>
                </Link>
              </li>
              <li>
                <div className="flex items-start gap-3 text-gray-400">
                  <MapPin size={18} className="mt-1 text-red-400 shrink-0" />
                  <div>
                    <span className="block text-sm">আমাদের ঠিকানা</span>
                    <span className="text-xs text-gray-500">
                      1/1, Meghna Shopping Complex, Shonir Akhra, Jatrabari, Dhaka.
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Company Info Section */}
          <div className="space-y-5 col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-3">
              কোম্পানির তথ্য
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="text-gray-400">
                <span className="block text-xs text-gray-500 mb-1">Trade License No:</span>
                <span className="font-semibold text-gray-300">TRAD/DNCC/037245/2022</span>
              </li>
              <li className="text-gray-400">
                <span className="block text-xs text-gray-500 mb-1">E-TIN Number:</span>
                <span className="font-semibold text-gray-300">197682866359</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700"></div>

        {/* Footer Bottom */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-4 text-gray-400">
            <Link href="#" className="hover:text-white transition-colors duration-200">
              Terms & Conditions
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="#" className="hover:text-white transition-colors duration-200">
              Refund Policy
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="#" className="hover:text-white transition-colors duration-200">
              Privacy Policy
            </Link>
          </div>
          <p className="text-gray-400 text-center md:text-right">
            © {currentYear} Skill শিখো. All rights reserved.{' '}
            <span className="inline-block">
              Developed by{' '}
              <Link
                href="https://www.devgenit.com"
                target="_blank"
                className="bg-clip-text text-transparent bg-linear-to-r from-orange-400 via-pink-500 to-purple-500 font-semibold hover:from-orange-300 hover:via-pink-400 hover:to-purple-400 transition-all duration-300"
              >
                DevGenit
              </Link>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
