import { Link } from 'react-router-dom';

type CustomLinkProps = {
  href: string;
  label: string;
};

export default function CustomLink({ href, label }: CustomLinkProps) {
  return (
    <Link className="bg-black text-white py-2 px-4 text-body" to={href}>
      {label}
    </Link>
  );
}
