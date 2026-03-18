import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/dashboard' },
        {
            path: '/dashboard',
            component: () => import('@/domains/dashboard/views/DashboardView.vue'),
        },
        {
            path: '/knowledge',
            component: () => import('@/domains/knowledge/views/KnowledgeEditor.vue'),
        },
        {
            path: '/knowledge/:id',
            component: () => import('@/domains/knowledge/views/KnowledgeEditor.vue'),
        },
        {
            path: '/tasks',
            component: () => import('@/domains/tasks/views/TaskEditor.vue'),
        },
        {
            path: '/tasks/:id',
            component: () => import('@/domains/tasks/views/TaskEditor.vue'),
        },
        {
            path: '/habits',
            component: () => import('@/domains/habits/views/HabitTracker.vue'),
        },
        {
            path: '/focus',
            component: () => import('@/domains/focus/views/FocusHistory.vue'),
        },
        {
            path: '/tasks/board',
            component: () => import('@/domains/tasks/views/TaskBoard.vue'),
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/dashboard',
        },
    ],
})
