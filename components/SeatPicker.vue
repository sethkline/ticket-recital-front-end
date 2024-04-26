 <template>
  <div>
    <div v-if="showMorning" class="p-4">
      <div class="mb-4">
        <h2 class="text-lg font-semibold">Morning Show Tickets</h2>
      </div>
      <div class="mb-4">
        <h3 class="text-md font-semibold">Selected Seats:</h3>
        <ul>
          <li v-for="seat in selectedMorningSeats" :key="seat.id" class="list-disc ml-5">
            Row: {{ seat?.attributes?.row }}, Number: {{ seat?.attributes?.number }}
          </li>
        </ul>
      </div>
      <div class="text-lg font-semibold">
        Morning Price: ${{ morningTotal.toFixed(2) }}
      </div>
    </div>
    <div v-if="showAfternoon" class="p-4">
      <div class="mb-4">
        <h2 class="text-md font-semibold">Afternoon Show Tickets</h2>
      </div>
      <div class="mb-4">
        <h3 class="text-md font-semibold">Selected Seats:</h3>
        <ul>
          <li v-for="seat in selectedAfternoonSeats" :key="seat.id" class="list-disc ml-5">
            Row: {{ seat?.attributes?.row }}, Number: {{ seat?.attributes?.number }}
          </li>
        </ul>
      </div>
      <div class="text-md font-semibold">
        Afternoon Price: ${{ afternoonTotal.toFixed(2) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCheckoutStore } from '~/stores/checkoutStore';

const props = defineProps<{ showType?: 'afternoon' | 'morning | both'; }>();

const checkoutStore = useCheckoutStore();
const { morningTotal, afternoonTotal, selectedMorningSeats, selectedAfternoonSeats, orderTotal } = storeToRefs(checkoutStore);

// const morningSelectedSeats = computed(() => {
//   return selectedSeatsDetails.value?.filter((seat) => seat?.)
// }) //eventId

const showMorning = computed(() => {
  const hasMorningValues = selectedMorningSeats.value.length > 0;
  if (props.showType && hasMorningValues) {
    return (props.showType === 'morning' || props.showType === 'both');
  } 
  return hasMorningValues
})
const showAfternoon = computed(() => {
  const hasAfternoonValues = selectedAfternoonSeats.value.length > 0;
  if (props.showType && hasAfternoonValues) {
    return (props.showType === 'afternoon' || props.showType === 'both');
  } 
  return hasAfternoonValues
})



</script>

<style scoped>

</style>