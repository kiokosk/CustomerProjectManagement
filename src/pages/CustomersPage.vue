<template>
  <q-page padding>
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12">
        <q-btn @click="openAddCustomerModal" color="primary" label="Add New Customer" />

        <q-input
          v-model="searchQuery"
          debounce="300"
          placeholder="Search customers"
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
          :rows="filteredRows"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="initialPagination"
          :rows-per-page-options="[10, 20, 50]"
        >
          <template v-slot:body-cell-address="props">
            <q-td :props="props">
              <q-tooltip>{{ props.value }}</q-tooltip>
              {{ props.value.substring(0, 20) }}{{ props.value.length > 20 ? '...' : '' }}
            </q-td>
          </template>

          <template v-slot:body-cell-edit="props">
            <q-td :props="props">
              <q-btn flat round color="primary" icon="edit" @click="openEditCustomerModal(props.row)">
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

    <CustomerForm
      v-model="showCustomerModal"
      :customer-data="currentCustomer"
      @save="saveCustomer"
    />

    <q-dialog v-model="showDeleteConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Are you sure you want to delete this customer?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="deleteCustomer" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import CustomerForm from 'components/CustomerForm.vue';

export default {
  components: {
    CustomerForm
  },
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const rows = ref([]);
    const loading = ref(false);
    const showCustomerModal = ref(false);
    const showDeleteConfirm = ref(false);
    const currentCustomer = ref({});
    const customerToDelete = ref(null);
    const searchQuery = ref('');

    const columns = [
      { name: 'id', label: '#', field: 'id', align: 'left', sortable: true },
      { name: 'name', label: 'Customer Name', field: 'name', align: 'left', sortable: true },
      { name: 'email', label: 'Email', field: 'email', align: 'left' },
      { name: 'address', label: 'Address', field: 'address', align: 'left', sortable: true },
      {
        name: 'edit',
        label: 'Action',
        align: 'center',
        style: 'width: 100px',
        headerStyle: 'width: 100px'
      }
    ];

    const initialPagination = {
      sortBy: 'id',
      descending: false,
      page: 1,
      rowsPerPage: 5
    };

    const fetchCustomers = async () => {
      loading.value = true;
      try {
        const response = await fetch('/api/v1/customers');
        if (!response.ok) throw new Error('Failed to fetch customers');
        rows.value = await response.json();
      } catch (error) {
        console.error(error);
        $q.notify({
          color: 'negative',
          message: 'Failed to fetch customers',
          icon: 'report_problem'
        });
      } finally {
        loading.value = false;
      }
    };

    const filteredRows = computed(() => {
      const query = searchQuery.value.toLowerCase();
      return rows.value.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(query)
        )
      );
    });

    const openAddCustomerModal = () => {
      currentCustomer.value = { name: '', email: '', address: '' };
      showCustomerModal.value = true;
    };

    const openEditCustomerModal = (customer) => {
      currentCustomer.value = { ...customer };
      showCustomerModal.value = true;
    };

    const saveCustomer = async (customer) => {
      const isEditing = !!customer.id;
      const url = isEditing ? `/api/v1/customers/${customer.id}` : '/api/v1/customers';
      const method = isEditing ? 'PUT' : 'POST';

      try {
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customer)

        });

        if (!response.ok) throw new Error('Failed to save customer');
        fetchCustomers();
        router.push('/customers');
      } catch (error) {
        console.error(error);
        $q.notify({
          color: 'negative',
          message: 'Failed to save customer',
          icon: 'report_problem'
        });
      }
    };

    const confirmDelete = (customer) => {
      customerToDelete.value = customer;
      showDeleteConfirm.value = true;
    };

    const deleteCustomer = async () => {
      if (!customerToDelete.value) return;

      try {
        const response = await fetch(`/api/v1/customers/${customerToDelete.value.id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete customer');
        // fetchCustomers();
        rows.value = rows.value.filter((row) => row.id !== customerToDelete.value.id);

        $q.notify({
          color: 'positive',
          message: 'Customer deleted successfully',
          icon: 'check_circle'

        });
      } catch (error) {
        console.error(error);
        $q.notify({
          color: 'negative',
          message: 'Failed to delete customer',
          icon: 'report_problem'
        });
      } finally {
        customerToDelete.value = null;
      }
    };

    fetchCustomers();

    return {
      rows,
      columns,
      loading,
      showCustomerModal,
      showDeleteConfirm,
      currentCustomer,
      initialPagination,
      openAddCustomerModal,
      openEditCustomerModal,
      saveCustomer,
      confirmDelete,
      deleteCustomer,
      searchQuery,
      filteredRows
    };
  }
};
</script>
