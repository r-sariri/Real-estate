import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon, type IconName } from './Icon';

type Variant = 'primary' | 'light' | 'outline' | 'outline-light';

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: 'md' | 'sm';
  icon?: IconName | null;
  block?: boolean;
  className?: string;
};

type ButtonAsLink = CommonProps & { to: string; href?: never; type?: never; onClick?: never; disabled?: never };
type ButtonAsAnchor = CommonProps & { href: string; to?: never; type?: never; onClick?: never; disabled?: never };
type ButtonAsButton = CommonProps & {
  to?: never;
  href?: never;
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
};

type ButtonProps = ButtonAsLink | ButtonAsAnchor | ButtonAsButton;

export function Button(props: ButtonProps) {
  const { children, variant = 'primary', size = 'md', icon = 'arrow-right', block, className = '' } = props;

  const classes = [
    'btn',
    `btn--${variant}`,
    size === 'sm' ? 'btn--sm' : '',
    block ? 'btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      <span>{children}</span>
      {icon ? <Icon name={icon} size={16} strokeWidth={1.7} /> : null}
    </>
  );

  if ('to' in props && props.to) {
    return (
      <Link to={props.to} className={classes}>
        {content}
      </Link>
    );
  }

  if ('href' in props && props.href) {
    return (
      <a href={props.href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button type={props.type ?? 'button'} className={classes} onClick={props.onClick} disabled={props.disabled}>
      {content}
    </button>
  );
}
