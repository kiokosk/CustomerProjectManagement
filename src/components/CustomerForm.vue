<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="custom-modal">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ isEditing ? 'Edit Customer' : 'Add New Customer' }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="customer.name"
            label="Customer Name"
            :rules="[val => !!val || 'Name is required']"

          />
          <q-input
            v-model="customer.email"
            label="Email"
            type="email"
            :rules="[
              val => !!val || 'Email is required',
              val => /.+@.+\..+/.test(val) || 'Invalid email'
            ]"

          />
          <q-input
            v-model="customer.address"
            label="Address"
           
            :rules="[val => !!val || 'Address is required']"

          />
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn flat label="Save" @click="onSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

export default {
  name: 'CustomerForm',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    customerData: {
      type: Object,
      default: () => ({ name: '', email: '', address: '' })
    }
  },
  emits: ['update:modelValue', 'save'],
  setup(props, { emit }) {
    const router = useRouter();
    const $q = useQuasar();
    const showDialog = ref(props.modelValue);
    const customer = ref({ ...props.customerData });
    const isEditing = ref(!!props.customerData.id);

    watch(() => props.modelValue, (newValue) => {
      showDialog.value = newValue;
    });

    watch(showDialog, (newValue) => {
      emit('update:modelValue', newValue);
    });

    watch(() => props.customerData, (newValue) => {
      customer.value = { ...newValue };
      isEditing.value = !!newValue.id;
    }, { deep: true });

    const onSubmit = () => {
      emit('save', customer.value);
      showDialog.value = false;

      const successMessage = isEditing.value
        ? 'Customer updated successfully'
        : 'Customer added successfully';

      $q.notify({
        color: 'positive',
        message: successMessage,
        icon: 'check_circle'
      });

      router.push('/customers');
    };

    return {
      showDialog,
      customer,
      isEditing,
      onSubmit
    };
  }
};
</script>


