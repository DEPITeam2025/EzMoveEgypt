import {Outlet} from 'react-router'


function MainLayout() {
    return (
    <div>
        <main>
            <Outlet />
        </main>
    </div>);
}

export default MainLayout;