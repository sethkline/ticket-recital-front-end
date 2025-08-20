<template>
  <div>
    <EventInfo />
    
    <!-- Digital Downloads Hero Section -->
    <div class="bg-gradient-to-r from-green-50 to-blue-50 py-12 px-4 mt-8">
      <div class="max-w-2xl mx-auto text-center">
        <Card class="shadow-xl">
          <template #title>
            <div class="flex flex-col items-center gap-3">
              <i class="pi pi-video text-5xl text-green-600"></i>
              <h2 class="text-3xl font-bold">2025 Recital Recording Now Available!</h2>
            </div>
          </template>
          <template #content>
            <div class="space-y-4">
              <p class="text-lg text-gray-700">
                Relive the magic of "Echoes of Grace: Stories in Motion"
              </p>
              
              <div class="bg-white rounded-lg p-4 text-left">
                <ul class="space-y-2">
                  <li class="flex items-start gap-2">
                    <i class="pi pi-check-circle text-green-500 mt-1"></i>
                    <span>Full recital recording in HD and Standard quality</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i class="pi pi-check-circle text-green-500 mt-1"></i>
                    <span>All 38 individual dance performances</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i class="pi pi-check-circle text-green-500 mt-1"></i>
                    <span>Download or stream with your access code</span>
                  </li>
                </ul>
              </div>

              <Button 
                @click="$router.push('/watch-recital')" 
                label="Access Your Videos" 
                icon="pi pi-play" 
                severity="success"
                size="large"
                class="w-full md:w-auto px-8 py-3 text-lg"
              />
              
              <p class="text-sm text-gray-600 mt-4">
                Have your access code ready from your digital download purchase
              </p>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>