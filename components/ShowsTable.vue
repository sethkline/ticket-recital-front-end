<template>
  <DataTable :value="shows">
    <Column field="name" header="Show Name"></Column>
    <Column field="date" header="Date"></Column>
    <Column field="actions" header="Actions" :body="actionTemplate"></Column>
  </DataTable>
</template>

<script setup>
import { DataTable, Column } from 'primevue/datatable';

const shows = ref([]);

const actionTemplate = (rowData) => {
  return (
    <div>
      <Button label="Edit" icon="pi pi-pencil" onClick={() => editShow(rowData)} />
      <Button label="Delete" icon="pi pi-trash" onClick={() => deleteShow(rowData.id)} />
    </div>
  );
};

function editShow(show) {
  // Logic to handle show editing
}

function deleteShow(id) {
  // Logic to handle show deletion
}
</script>