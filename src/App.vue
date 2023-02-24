<template>
  <el-scrollbar always>
    <el-config-provider :locale="zhCn">
      <router-view></router-view>
  </el-config-provider>

  </el-scrollbar>
  
</template>

<script lang="ts" setup>
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
</script>
