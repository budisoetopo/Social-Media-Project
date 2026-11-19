import Link from 'next/link';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { Logo_Red } from '../../../public/images/imageHandler';

const socials = [
  { name: 'Facebook', href: '#', Icon: FaFacebook },
  { name: 'Instagram', href: '#', Icon: FaInstagram },
  { name: 'LinkedIn', href: '#', Icon: FaLinkedin },
  { name: 'Twitter', href: '#', Icon: FaTwitter },
];

function Footer() {
  return (
    <footer className='bg-[#0a0a0a] text-gray-300 py-12 border-t border-gray-800 w-full mt-auto'>
      <div className='max-w-360 mx-auto px-4 md:px-30 grid grid-cols-1 md:grid-cols-4 gap-8'>
        {/* Brand Col */}
        <div className='col-span-1 md:col-span-2'>
          <Link
            href='/'
            className='text-2xl font-bold text-white mb-4 flex items-center gap-3.75'
          >
            <img
              src={Logo_Red}
              alt='Foody Logo'
              className='h-7 w-7 object-contain'
            />
            Sociality
          </Link>
          <p className='text-sm text-gray-400 max-w-sm mb-6 leading-relaxed'>
            Enjoy homemade meals & delight delicious dishes. Freshly prepared
            every day. Order online or visit our nearest branch.
          </p>
          <div className='text-sm font-semibold text-white mb-3'>
            Follow on Social Media
          </div>
          <div className='flex gap-4'>
            {socials.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                aria-label={name}
                className='text-gray-400 hover:text-white transition'
              >
                <Icon size={18} aria-hidden='true' />
              </a>
            ))}
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4 md:col-span-2'>
          {/* Explore Col */}
          <div>
            <h4 className='text-white font-semibold mb-4'>Explore</h4>
            <ul className='space-y-2 text-sm text-gray-400'>
              {[
                'All Food',
                'Nearby',
                'Discount',
                'Best Seller',
                'Delivery',
                'Lunch',
              ].map((item) => (
                <li key={item}>
                  <Link href='#' className='hover:text-white transition'>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Col */}
          <div>
            <h4 className='text-white font-semibold mb-4'>Help</h4>
            <ul className='space-y-2 text-sm text-gray-400'>
              {[
                'How to Order',
                'Payment Methods',
                'Track My Order',
                'FAQ',
                'Contact Us',
              ].map((item) => (
                <li key={item}>
                  <Link href='#' className='hover:text-white transition'>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
