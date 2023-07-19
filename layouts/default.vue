<template>
    <div class="h-screen flex-1 flex flex-col items-stretch justify-between">
        <LayoutHeader class="flex-shrink-0"></LayoutHeader>
        <div class="flex flex-col items-stretch justify-center overflow-hidden">
            <el-scrollbar>
                <slot></slot>
            </el-scrollbar>
        </div>
        <LayoutFooter class="flex-shrink-0"></LayoutFooter>
    </div>
</template>
