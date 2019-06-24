<style scoped>
    .active {
        color: rgba(45, 140, 240, .9) !important;
    }

    .active :after {
        display: inline-block;
        font-family: Ionicons;
        speak: none;
        font-style: normal;
        font-weight: 400;
        font-variant: normal;
        text-transform: none;
        text-rendering: auto;
        line-height: 1;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        float: right;
        font-size: 24px;
        content: "\F3FD";
        color: rgba(45, 140, 240, .9);
    }

    .ivu-dropdown-item-disabled:hover {
        background-color: transparent;
    }

    .ivu-dropdown-item-disabled {
        color: #bbbec4 !important;
    }

</style>
<template>
    <Dropdown-item :class="{ 'active': selected === true }" :disabled="disabled">
        <div @click.stop="select" ref="item" style="line-height: 15px">
            <slot>{{ showLabel }}</slot>
        </div>
    </Dropdown-item>
</template>
<script>


    export default {
        name: 'result',
        props: {
            value: {
                type: [String, Number],
                required: true
            },
            label: {
                type: [String, Number]
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                selected: false
            };
        },
        computed: {
            showLabel() {
                return (this.label) ? this.label : this.value;
            }
        },
        methods: {
            select() {
                if (this.disabled) return;
                this.selected = !this.selected;
                this.$parent.resultSelectChanged({id: this.value, name: this.label, selected: this.selected});
            },
            refresh() {
                if (this.disabled) return;
                this.selected = false;
                var that = this;
            },
            selectStateChanged(result, selected) {
                if (result.id != this.value) return;
                this.selected = selected;
            }
        }
    };
</script>
