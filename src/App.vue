<template>
  <div class="md:p-6 mx-auto overflow-hidden bg-gray-100  h-screen flex flex-col items-center">
    <div class="w-full flex justify-center items-center">
      <h1 class="text-xl md:text-3xl font-bold text-center md:text-left">Log tracer</h1>
    </div>
    <div>
      <div class=" w-full items-center justify-end space-x-2">
        <div class="flex space-x-2 items-center justify-center pt-2 h-12.5">
          <input v-model="logKey" @keydown.enter="getCache()" type="text" class="w-100 border-2 px-2 h-8 rounded-lg" >
          <button @click="getCache()" class="rounded-lg border-2 h-10 px-4">Get log</button>
        </div>
      </div>
    </div>
    <div class="flex flex-row space-x-2 mb-2 items-start mt-2.5 h-40 w-full">
      <div class="w-[50%] h-full">
        <textarea
            v-model="input"
            class="border border-gray-300 bg-white w-full h-full min-h-37.5 md:min-h-37.5 p-4 rounded-md font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            placeholder="Nhập JSON..."
            @input="formatJson"
        ></textarea>
      </div>
      <div class="w-[50%] h-full border border-gray-200 rounded-lg p-4
                  shadow-sm bg-white mb-4 hover:shadow-md transition-shadow duration-200">
        <div class="flex">
          <div class="flex flex-col md:space-x-6 space-y-2 md:space-y-0 w-[70%]">
            <div class="flex items-end space-x-2">
              <h1 class="font-bold text-gray-800">Path:</h1>
              <p class="text-gray-700 font-bold text-xl">{{ outputHtml?.path?.split(':')[1] }}</p>
            </div>
            <div class="flex items-end space-x-2">
              <h1 class="font-bold text-gray-800">Username:</h1>
              <p class="text-gray-700 text-xl">{{ outputHtml?.username }}</p>
            </div>

            <div class="flex items-end space-x-2">
              <h1 class="font-bold text-gray-800">RequestId:</h1>
              <p class="text-gray-700 text-xl">{{ outputHtml?.requestId }}</p>
            </div>
            <div class="flex items-end space-x-2">
              <h1 class="font-bold text-gray-800">SessionId:</h1>
              <p class="text-gray-700 text-xl">{{ outputHtml?.sessionId }}</p>
            </div>
            <div class="flex items-end space-x-2">
              <h1 class="font-bold text-gray-800">processDuration</h1>
              <p class="text-gray-700 text-xl">{{ outputHtml?.processDuration }} ms</p>
            </div>
          </div>
          <div class="w-[30%] flex items-center space-x-2">
            <button v-if="input.length!=0"
                    class="rounded-lg border-2 h-20 px-4 cursor-pointer hover:bg-green-100"
                    @click="writeCache()">Send log for handsomeBoy Chinhnd1</button>
          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">
      <div class="flex flex-col w-full">
        <div
            class="border border-gray-200 rounded-lg p-4 shadow-sm bg-white h-165 max-h-175 overflow-scroll hover:shadow-md transition-shadow duration-200">
          <JsonData :data="outputHtml"/>
        </div>
      </div>

      <div class="flex flex-col w-full">
        <div
            class="flex flex-col max-h-165 overflow-auto p-2 pb-5 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
          <h2 class="mb-2 font-bold text-xl text-gray-800">Logs details</h2>
          <div class="flex flex-col space-y-3">
            <LogDetail v-for="(log, index) in logs" :key="index" :detail="log"/>
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
  logKey.value = crypto.randomUUID()
  await redis.set(logKey.value, input.value, {
    ex: 300
  })
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
