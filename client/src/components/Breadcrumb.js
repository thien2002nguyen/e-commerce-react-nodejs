import React from 'react';
import useBreadcrumb from 'use-react-router-breadcrumbs'
import { Link } from 'react-router-dom';
import icons from '../ultils/icons';
const { IoIosArrowForward } = icons

const Breadcrumb = ({ title, category }) => {
    const routes = [
        { path: "/:category", breadcrumb: category === ':category' ? 'products' : category },
        { path: "/", breadcrumb: "Home" },
        { path: ":category/:pid/:title", breadcrumb: title }
    ];
    const breadcrumb = useBreadcrumb(routes)
    return (
        <div className='text-sm flex items-center gap-[2px]'>
            {breadcrumb?.filter(element => !element.match.route === false).map(({ match, breadcrumb }, index, self) => (
                <Link
                    className='flex items-center gap-[2px] capitalize hover:text-main duration-150'
                    key={index}
                    to={match.pathname}>
                    <span>{breadcrumb}</span>
                    {index !== self.length - 1 && <IoIosArrowForward size={8} />}
                </Link>
            ))}
        </div>
    );
};

export default Breadcrumb;