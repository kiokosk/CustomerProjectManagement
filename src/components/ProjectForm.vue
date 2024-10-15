<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      v-model="project.name"
      label="Project Name"
      :rules="[val => !!val || 'Project name is required']"
      :error="!!formErrors.name"
      :error-message="formErrors.name"
    />

    <q-input
      v-model="project.description"
      label="Description"
      :rules="[val => !!val || 'Project description is required']"
      :error="!!formErrors.description"
      :error-message="formErrors.description"
    />

    <q-select
      v-model="project.customerId"
      :options="customerOptions"
      label="Customer"
      :rules="[val => val !== null || 'Customer is required']"
      emit-value
      map-options
      options-dense
      :loading="loadingCustomers"
      :error="!!formErrors.customerId"
      :error-message="formErrors.customerId"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            No customers found
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <div>
      <q-btn :label="isEditing ? 'Update' : 'Submit'" type="submit" color="primary"/>
      <q-btn label="Cancel" @click="onCancel" color="secondary" flat class="q-ml-sm"/>
    </div>
  </q-form>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import{Project, Customer, FormErrors} from './models';


export default defineComponent({
  name: 'ProjectForm',
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const route = useRoute();
    const project = ref<Project>({ name: '', description: '', customerId: null });
    const customers = ref<Customer[]>([]);
    const loadingCustomers = ref(false);
    const isEditing = computed(() => !!route.params.id);
    const formErrors = ref<FormErrors>({});

    const customerOptions = computed(() =>
      customers.value.map(customer => ({
        label: customer.name,
        value: customer.id
      }))
    );

    const fetchProject = async (id: string) => {
      try {
        const response = await fetch(`/api/v1/projects/${id}`);
        if (!response.ok) throw new Error('Failed to fetch project');
        const data = await response.json();
        project.value = { ...data, customerId: data.customerId || null };
      } catch (error) {
        console.error(error);
        $q.notify({
          color: 'negative',
          message: 'Failed to fetch project',
          icon: 'report_problem'
        });
      }
    };

    const fetchCustomers = async () => {
      loadingCustomers.value = true;
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
      } finally {
        loadingCustomers.value = false;
      }
    };

    onMounted(async () => {
      await fetchCustomers();
      if (isEditing.value) {
        await fetchProject(route.params.id as string);
      }
    });

    watch(() => route.params.id, async (newId) => {
      if (newId) {
        await fetchProject(newId as string);
      } else {
        project.value = { name: '', description: '', customerId: null };
      }
    });

    const onSubmit = async () => {
      formErrors.value = {};
      const url = isEditing.value ? `/api/v1/projects/${route.params.id}` : '/api/v1/projects';
      const method = isEditing.value ? 'PUT' : 'POST';

      try {
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(project.value)
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.error) {
            if (data.error.includes('project with this name already exists')) {
              formErrors.value.name = data.error;
            } else {
              $q.notify({
                color: 'negative',
                message: data.error,
                icon: 'warning'
              });
            }
          }
          if (data.emptyFields) {
            data.emptyFields.forEach((field: string) => {
              formErrors.value[field as keyof FormErrors] = `${field} is required`;
            });
          }
          return;
        }

        $q.notify({
          color: 'positive',
          message: `Project ${isEditing.value ? 'updated' : 'added'} successfully`,
          icon: 'check_circle'
        });

        router.push('/projects');
      } catch (error) {
        console.error(error);
        $q.notify({
          color: 'negative',
          message: 'Failed to save project',
          icon: 'report_problem'
        });
      }
    };

    const onCancel = () => {
      router.push('/projects');
    };

    return {
      project,
      isEditing,
      customerOptions,
      loadingCustomers,
      formErrors,
      onSubmit,
      onCancel
    };
  }
});
</script>
