import {Outlet} from 'react-router'

function AuthLayout() {
    return (
    <div>
        <main>
            <Outlet />
        </main>
    </div>);
}

export default AuthLayout;