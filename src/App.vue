<template>
  <div class="h-screen overflow-hidden bg-gray-100">

    <!-- APP -->
    <div class="h-full flex flex-col p-3 md:p-6">

      <!-- HEADER -->
      <div class="shrink-0">
        <div class="flex justify-center items-center mb-4">
          <h1 class="text-2xl md:text-4xl font-bold">
            Log tracer
          </h1>
        </div>

        <!-- SEARCH -->
        <div class="w-full flex justify-center mb-4">
          <div class="flex flex-col sm:flex-row w-full max-w-2xl gap-2">
            <input
                v-model="logKey"
                @keydown.enter="getCache()"
                type="text"
                placeholder="Input log key..."
                class="flex-1 border-2 px-3 h-11 rounded-lg bg-white"
            />
            <button
                @click="getCache()"
                class="h-11 px-5 rounded-lg border-2 bg-white hover:bg-green-100 cursor-pointer"
            >
              Get log
            </button>

          </div>
        </div>
      </div>

      <!-- CONTENT -->
      <div class="flex-1 overflow-hidden flex flex-col gap-4">

        <!-- TOP -->
        <div
            class="grid grid-cols-1 xl:grid-cols-2 gap-4
                 shrink-0"
        >

          <!-- INPUT -->
          <textarea
              v-model="input"
              @input="formatJson"
              placeholder="Nhập JSON..."
              class="w-full h-45 border border-gray-300
                   bg-white p-4 rounded-lg font-mono
                   resize-none"
          ></textarea>

          <div class="border border-gray-200 rounded-lg bg-white overflow-auto p-2 ">
            <div class="flex space-x-2 items-center">
              <span class="font-bold text-gray-800"> Path: </span>
              <p class="text-lg  font-bold text-gray-700">{{ outputHtml?.path?.split(':')[1] }}</p>
            </div>
            <div class="flex space-x-2 items-center">
              <span class="font-bold text-gray-800"> Username: </span>
              <p class="text-lg text-gray-700">{{ outputHtml?.username }}</p>
            </div>
            <div class="flex space-x-2 items-center">

              <span class="font-bold text-gray-800"> RequestId: </span>
              <p class="text-lg text-gray-700">{{ outputHtml?.requestId }}</p>
            </div>
            <div class="flex space-x-2 items-center">

              <span class="font-bold text-gray-800"> SessionId: </span>
              <p class="text-lg text-gray-700">{{ outputHtml?.sessionId }}</p>
            </div>
            <div class="flex space-x-2 items-start justify-between">
              <div class="flex space-x-2 items-center">
                <span class="font-bold text-gray-800">  Process Duration: </span>
                <p class="text-lg text-gray-700">{{ outputHtml?.processDuration }}</p>
              </div>
              <div class="flex flex-col items-start pr-5">
                <button v-if="input.length !=0"
                        @click="writeCache()"
                        class="h-11 px-5 rounded-lg border-2 bg-white hover:bg-green-100 cursor-pointer"
                >
                  Send log and copy LogId
                </button>
                <h1 v-if="copied" class="text-red-500 font-bold">LogId copied!</h1>
              </div>
            </div>

          </div>



        </div>

        <!-- BOTTOM -->
        <div
            class="flex-1 overflow-hidden
                 grid grid-cols-1 xl:grid-cols-2 gap-4"
        >

          <!-- JSON -->
          <div
              class="border border-gray-200 rounded-lg
                   p-4 bg-white overflow-auto"
          >
            <JsonData :data="outputHtml" />
          </div>

          <!-- LOG -->
          <div
              class="border border-gray-200 rounded-lg
                   p-4 bg-white overflow-auto"
          >
            <div class="space-y-3">
              <LogDetail
                  v-for="(log, index) in logs"
                  :key="index"
                  :detail="log"
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'
import LogDetail from "./components/LogDetail.vue";
import JsonData from "./components/JsonData.vue";
import type {ILog, ILogs} from "./utils/Log.ts";
import {redis} from "./apis/_lib/redis.ts";



const input = ref('')
const error = ref('')
const success = ref(false)
const logs = ref<ILog[]>([])
const outputHtml = ref<ILogs>()
const logKey =  ref('')
const copied = ref(false);

watch(() => input.value, () => {
  formatJson()
})


const formatJson = () => {
  try {
    outputHtml.value = JSON.parse(input.value) as ILogs
    logs.value = outputHtml.value.logs
    error.value = ''
    success.value = true
  } catch (e: any) {
    error.value = e.message
    success.value = false
    logs.value = [] as ILog[]
    try {
      outputHtml.value = JSON.parse(input.value)
    } catch (e: any) {
      error.value = e.message
      success.value = false
      logs.value = [] as ILog[]
      outputHtml.value = e.message

    }
  }
}

const writeCache = async()=>{
  const key = crypto.randomUUID()
  await redis.set(key, input.value, {
    ex: 300
  })
  await navigator.clipboard.writeText(key)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1500)
}

const getCache = async()=>{
  const data = await redis.get(logKey.value)
  console.log(data)
  input.value = JSON.stringify(data)
}

</script>
<style>
body {
  font-family: sans-serif;
}
</style>
