<template>
  <q-page padding>
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12">
        <q-btn @click="addProject" color="primary" label="Add New Project" />
        <q-input
          v-model="searchQuery"
          debounce="300"
          placeholder="Search projects"
          clearable
          class="q-mt-md"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-table
          :rows="filteredProjects"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="initialPagination"
          :rows-per-page-options="[10, 20, 50]"
        >
          <template v-slot:body-cell-description="props">
            <q-td :props="props">
              <q-tooltip>{{ props.value }}</q-tooltip>
              {{ props.value.substring(0, 50) }}{{ props.value.length > 50 ? '...' : '' }}
            </q-td>
          </template>

          <template v-slot:body-cell-customer="props">
            <q-td :props="props">
              {{ getCustomerName(props.value) }}
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-sm">
              <q-btn flat round color="primary" icon="edit" @click="editProject(props.row.id)">
                <q-tooltip>Edit</q-tooltip>
              </q-btn>
              <q-btn flat round color="negative" icon="delete" @click="confirmDelete(props.row)">
                <q-tooltip>Delete</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <q-dialog v-model="showDeleteConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Are you sure you want to delete this project?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="deleteProject" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useQuasar, QTableColumn } from 'quasar';
import { useRouter } from 'vue-router';

interface Project {
  id: number;
  name: string;
  description: string;
  customerId: number;
}

interface Customer {
  id: number;
  name: string;
}

export default defineComponent({
  name: 'ProjectsPage',
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const projects = ref<Project[]>([]);
    const customers = ref<Customer[]>([]);
    const loading = ref(false);
    const showDeleteConfirm = ref(false);
    const projectToDelete = ref<Project | null>(null);
    const searchQuery = ref('');

    const columns: QTableColumn[] = [
      { name: 'id', align: 'left', label: '#', field: 'id', sortable: true },
      { name: 'name', align: 'left', label: 'Project Name', field: 'name', sortable: true },
      { name: 'description', align: 'left', label: 'Description', field: 'description' },
      { name: 'customer', align: 'left', label: 'Customer', field: 'customerId', sortable: true },
      { name: 'actions', align: 'center', label: 'Action', field: 'actions', sortable: false }
    ];

    const initialPagination = {
      sortBy: 'id',
      descending: false,
      page: 1,
      rowsPerPage: 5
    };

    const fetchProjects = async () => {
      loading.value = true;
      try {
        const response = await fetch('/api/v1/projects');
        if (!response.ok) throw new Error('Failed to fetch projects');
        projects.value = await response.json();
      } catch (error) {
        console.error(error);
        $q.notify({
          color: 'negative',
          message: 'Failed to fetch projects',
          icon: 'report_problem'
        });
      } finally {
        loading.value = false;
      }
    };

    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/v1/customers');
        if (!response.ok) throw new Error('Failed to fetch customers');
        customers.value = await response.json();
      } catch (error) {
        console.error(error);
        $q.notify({
          color: 'negative',
          message: 'Failed to fetch customers',
          icon: 'report_problem'
        });
      }
    };

    onMounted(() => {
      fetchProjects();
      fetchCustomers();
    });

    const filteredProjects = computed(() => {
      const query = searchQuery.value.toLowerCase();
      return projects.value.filter(project =>
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        getCustomerName(project.customerId).toLowerCase().includes(query)
      );
    });

    const getCustomerName = (customerId: number) => {
      const customer = customers.value.find(c => c.id === customerId);
      return customer ? customer.name : 'Unknown';
    };

    const addProject = () => {
      router.push('/project/add');
    };

    const editProject = (id: number) => {
      router.push(`/project/edit/${id}`);
    };

    const confirmDelete = (project: Project) => {
      projectToDelete.value = project;
      showDeleteConfirm.value = true;
    };

    const deleteProject = async () => {
      if (!projectToDelete.value) return;

      try {
        const response = await fetch(`/api/v1/projects/${projectToDelete.value.id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete project');

        projects.value = projects.value.filter(p => p.id !== projectToDelete.value!.id);

        $q.notify({
          color: 'positive',
          message: 'Project deleted successfully',
          icon: 'check_circle'
        });
      } catch (error) {
        console.error(error);
        $q.notify({
          color: 'negative',
          message: 'Failed to delete project',
          icon: 'report_problem'
        });
      } finally {
        projectToDelete.value = null;
        showDeleteConfirm.value = false;
      }
    };

    return {
      projects,
      columns,
      loading,
      initialPagination,
      showDeleteConfirm,
      searchQuery,
      filteredProjects,
      getCustomerName,
      addProject,
      editProject,
      confirmDelete,
      deleteProject
    };
  }
});
</script>
