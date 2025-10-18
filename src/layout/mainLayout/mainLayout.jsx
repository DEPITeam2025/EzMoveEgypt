
import {Outlet} from 'react-router'


function mainLayout() {
    return (
    <div>
        <main>
            <Outlet />
        </main>
    </div>);
}

export default mainLayout;