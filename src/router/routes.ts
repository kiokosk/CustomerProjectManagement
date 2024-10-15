import { RouteRecordRaw } from 'vue-router';
import MainLayout from 'layouts/MainLayout.vue';
import IndexPage from 'pages/IndexPage.vue';
import CustomersPage from 'pages/CustomersPage.vue';
import ProjectsPage from 'pages/ProjectsPage.vue';
import ErrorNotFound from 'pages/ErrorNotFound.vue';
import CustomerForm from 'src/components/CustomerForm.vue';
import ProjectForm from 'src/components/ProjectForm.vue';


const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        component: IndexPage,
      },
      {
        path: 'customers',
        component: CustomersPage,
      },
      {
        path: 'customer/add',
        component: CustomerForm,
      },
      {
        path: 'customer/edit/:id',
        component: CustomerForm,
        props: true
      },
      {
        path: 'projects',
        component: ProjectsPage,
      },
      {
        path: 'project/add',
        component: ProjectForm,
      },
      {
        path: 'project/edit/:id',
        component: ProjectForm,
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: ErrorNotFound,
  },
];

export default routes;
