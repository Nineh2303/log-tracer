<template>
  <div class="p-4 md:p-6 mx-auto w-full  bg-gray-100">
    <h1 class="text-2xl md:text-3xl font-bold mb-4 text-center md:text-left">JSON Formatter & Validator</h1>
    <h2 class="mb-2 font-bold text-xl text-gray-800">Input JSON</h2>
    <div class="flex flex-row mb-6 w-full items-center">
      <div class="w-[50%] h-full">
        <textarea
            v-model="input"
              class="border border-gray-300 w-full min-h-[150px] md:min-h-[150px] p-4 rounded-md font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            placeholder="Nhập JSON..."
            @input="formatJson"
        ></textarea>
      </div>
      <div class="w-[50%] h-[150px] border border-gray-200 rounded-lg p-4 shadow-sm bg-white mb-4 hover:shadow-md transition-shadow duration-200">
        <div class="flex flex-col  md:space-x-6 space-y-2 md:space-y-0">
          <div class="flex items-center space-x-2">
            <h1 class="font-bold text-gray-800">RequestId:</h1>
            <p class="text-gray-700">{{ outputHtml?.requestId }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <h1 class="font-bold text-gray-800">Username:</h1>
            <p class="text-gray-700">{{ outputHtml?.username }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <h1 class="font-bold text-gray-800">CustomerId:</h1>
            <p class="text-gray-700">{{ outputHtml?.customerId }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <h1 class="font-bold text-gray-800">SessionId:</h1>
            <p class="text-gray-700">{{ outputHtml?.sessionId }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

      <div class="flex flex-col">
        <div class="border border-gray-200 rounded-lg p-4 shadow-sm bg-white max-h-[850px] overflow-auto hover:shadow-md transition-shadow duration-200">
          <JsonData :data="outputHtml"/>
        </div>
      </div>

      <div class="flex flex-col w-full">


        <div class="flex flex-col max-h-[850px] overflow-auto p-2 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
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
import { ref } from 'vue'
import {type ILogs, type ILog, LogType} from "./utils/Log.ts"
import JsonData from "./components/JsonData.vue"
import LogDetail from "./components/LogDetail.vue"

const input = ref('')
const error = ref('')
const success = ref(false)
const logs = ref<ILog[]>([])
const outputHtml = ref<ILogs>()

const formatJson = () => {
  try {
    outputHtml.value = JSON.parse(input.value) as ILogs
    logs.value = sortData(outputHtml.value.logs)
    error.value = ''
    success.value = true
  } catch (e: any) {
    error.value = e.message
    success.value = false
    logs.value = [] as ILog[]
    outputHtml.value = e.message
  }
}
const sortData = (logs: ILog[]) => {
  return logs.sort((log)=>  log.logType === LogType.EXCEPTION
  || JSON.stringify(log ?? {}).includes('exception') ? -1 : 1)
}
</script>

<style>
body {
  font-family: sans-serif;
}
</style>
