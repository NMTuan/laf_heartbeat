<template>
    <div class="w-720px mx-auto bg-white shadow min-h-screen">
        <LayoutHeader class="flex-shrink-0"></LayoutHeader>
        <div class="overflow-hidden">
            <slot></slot>
        </div>
        <LayoutFooter class="flex-shrink-0"></LayoutFooter>
    </div>
</template>
