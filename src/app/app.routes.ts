import { Routes } from '@angular/router';
import { Login } from './Components/login/login';
import { StoreSignup } from './Components/store-signup/store-signup';
import { Dashboard } from './Components/dashboard/dashboard';
import { Terminal } from './Components/terminal/terminal';
import { MemberSignup } from './Components/member-signup/member-signup';
import { UpdatePassword } from './Components/update-password/update-password';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: 'signup',
        component: StoreSignup
    },
    {
        path: 'dashboard/:store_id',
        component: Dashboard
    },
    {
        path: 'terminal',
        component: Terminal
    },
    {
        path: 'member-signup',
        component: MemberSignup
    },
    {
        path: 'update-password',
        component: UpdatePassword
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];

