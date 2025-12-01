<template>

  <div class="w-full border-2 rounded-lg flex items-center flex-col cursor-pointer"
       :class="!isException ? 'border-green-400 ':'border-red-400 '"
        >
     <div class="w-full flex justify-between h-[50px] items-center rounded-lg px-[25px]"
          :class="!isException ? 'bg-green-400 ':'bg-red-400'" @click="changeShow">
       <h1 class="font-bold text-white text-[20px] "
       >{{detail.logType}}
       </h1>
       <button class="w-[40px] h-[40px] rounded-lg border-2 flex items-center justify-center border-white"
             >
         <ChevronDownIcon class="w-10 h-10 text-white cursor-pointer transition-all duration-100" :class="!isShow ?'rotate-180' : ''"/>
       </button>
     </div>
      <div class="w-full  transition-all duration-100"
           :class="!isShow ?'h-0 opacity-0':'h-[350px] opacity-100' "
      >
        <json-data :data="props.detail"/>
      </div>
  </div>
</template>

<script setup lang="ts">
import {type ILog, LogType} from "../utils/Log.ts";
import {computed, ref, watch} from "vue";
import {syntaxHighlight} from "../utils/SyntaxHightLight.ts";
import JsonData from "./JsonData.vue";
import {ChevronDownIcon} from "@heroicons/vue/16/solid";

export interface LogDetailProps {
  detail: ILog
}

const isException = computed(() =>
    props.detail?.logType === LogType.EXCEPTION
    || JSON.stringify(props.detail ?? {}).includes('exception')
);

const props = defineProps<LogDetailProps>()
const outputHtml = ref('')
const isShow = ref<boolean>(false)


outputHtml.value = syntaxHighlight(JSON.stringify(props.detail, null, 2))
// console.log(props.detail.logType, isException.value)

watch(props.detail,()=>{
  console.log("change!!")
})
const changeShow = () => {
  isShow.value = !isShow.value;
}
</script>

<style lang="scss" scoped>

</style>