 <template>
  <div class="p-4">
    <div class="mb-4" v-if="selectEventDetails">
      <h2 class="text-lg font-semibold">Selected Show: {{ selectEventDetails?.name }}</h2>
    </div>
    <div class="mb-4" v-if="selectedSeatsDetails && selectedSeatsDetails.length">
      <h3 class="text-md font-semibold">Selected Seats:</h3>
      <ul>
        <li v-for="seat in selectedSeatsDetails" :key="seat.id" class="list-disc ml-5">
          Row: {{ seat?.attributes?.row }}, Number: {{ seat?.attributes?.number }}
        </li>
      </ul>
    </div>
    <div class="text-lg font-bold">
      Total Price: ${{ ticketQuickTotal.toFixed(2) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCheckoutStore } from '~/stores/checkoutStore';

const checkoutStore = useCheckoutStore();
const { selectEventDetails, selectedSeatsDetails, ticketQuickTotal } = storeToRefs(checkoutStore);



</script>

<style scoped>

</style>