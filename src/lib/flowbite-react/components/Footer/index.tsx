import classNames from 'classnames';
import { FC, PropsWithChildren } from 'react';
import { FooterBrand } from './FooterBrand';
import { FooterCopyright } from './FooterCopyright';
import { FooterLink } from './FooterLink';
import { FooterLinkGroup } from './FooterLinkGroup';
import { FooterIcon } from './FooterIcon';

export type FooterComponentProps = PropsWithChildren<{
  className?: string;
}>;

const FooterComponent: FC<FooterComponentProps> = ({ children, className }) => {
  return (
    <footer
      className={classNames(
        'w-full bg-gray-100 shadow-lg p-4 dark:bg-zinc-800 md:flex md:items-center md:justify-between md:p-6',
        className,
      )}
    >
      {children}
    </footer>
  );
};

FooterComponent.displayName = 'Footer';
FooterCopyright.displayName = 'Footer.Copyright';
FooterLink.displayName = 'Footer.Link';
FooterBrand.displayName = 'Footer.Brand';
FooterLinkGroup.displayName = 'Footer.LinkGroup';
FooterIcon.displayName = 'Footer.Icon';

export const Footer = Object.assign(FooterComponent, {
  Copyright: FooterCopyright,
  Link: FooterLink,
  LinkGroup: FooterLinkGroup,
  Brand: FooterBrand,
  Icon: FooterIcon,
});
