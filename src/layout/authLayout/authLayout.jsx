
import {Outlet} from 'react-router'

function authLayout() {
    return (
    <div>
        <main>
            <Outlet />
        </main>
    </div>);
}

export default authLayout;