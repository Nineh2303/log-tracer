<template>
  <div class="p-6 pt-[10px] mx-auto w-full overflow-hidden">
    <div class="max-h-[10%]">
      <h1 class="text-2xl font-bold mb-4 ">JSON Formatter & Validator</h1>
      <div class="flex-1 flex flex-col">
        <h2 class="mb-2 font-bold text-xl">Input JSON</h2>
        <textarea
            v-model="input"
            class="border w-full flex-1 min-h-[150px] p-3 rounded-lg font-mono"
            placeholder="Nhập JSON..."
            @input="formatJson"
        ></textarea>
      </div>
    </div>
    <div class="flex flex-row w-full mt-[25px] max-h-[7 00px] space-x-[5%] overflow-hidden">
<!--      left-->
      <div class="w-[45%] flex flex-col h-full justify-between">
        <div class="border-1 rounded-lg max-h-[700px] overflow-scroll">
          <JsonData :data="outputHtml"/>
        </div>
      </div>
      <div class="flex flex-col w-[50%] max-h-[700px] overflow-hidden">
        <div class="border-2 rounded-lg p-[5px]">
          <div class="flex space-x-2 items-center">
            <h1 class="text-[20px] font-bold">RequestId: </h1>
            <p class="text-[18px]">{{ outputHtml?.requestId }}</p>
          </div>
          <div class="flex space-x-2 items-center">
            <h1 class="text-[20px] font-bold">Username: </h1>
            <p class="text-[18px]">{{ outputHtml?.username }}</p>
          </div>
          <div class="flex space-x-2 items-center">
            <h1 class="text-[20px] font-bold">CustomerId: </h1>
            <p class="text-[18px]">{{ outputHtml?.customerId }}</p>
          </div>
          <div class="flex space-x-2 items-center">
            <h1 class="text-[20px] font-bold">SessionId: </h1>
            <p class="text-[18px]">{{ outputHtml?.sessionId }}</p>
          </div>
        </div>
        <div class="flex flex-col overflow-scroll">
          <h1 class="mb-2 font-bold text-xl mt-[10px]">Logs details</h1>
          <div class="flex-col space-y-3 py-[10px">
            <LogDetail v-for="log in logs" :detail="log"/>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {type ILogs, type ILog} from "./utils/Log.ts";
import JsonData from "./components/JsonData.vue";
import LogDetail from "./components/LogDetail.vue";

const input = ref('')
const error = ref('')
const success = ref(false)
const logs = ref<ILog[]>([])
const outputHtml = ref<ILogs>()

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
    outputHtml.value = e.message
  }
}

</script>

<style>
body {
  background: #f5f5f5;
  font-family: sans-serif;
}
</style>


