<template lang="html">
  <div class="posts">
    <TitleBlock title="Роли" :breadbrumb="['Главный']" lastLink="Роли">
      <div class="d-flex">
        <div
          class="add-btn add-header-btn add-header-btn-padding btn-light-primary mx-3"
          @click="$router.push('/settings/roles')"
        >
          Отмена
        </div>
        <a-button
          class="add-btn add-header-btn btn-primary d-flex align-items-center"
          type="primary"
          v-if="checkAccess('roles', 'put')"
          @click="onSubmit"
        >
          <span class="svg-icon"> </span>
          Сохранять
        </a-button>
      </div>
    </TitleBlock>
    <a-form-model :model="form" ref="ruleForm" :rules="rules" layout="vertical">
      <div class="pb-5 pt-5">
        <div class="container_xl app-container d-flex flex-column">
          <div class="">
            <div class="card_block main-table px-4 py-4">
              <FormTitle title="Создать роль" />
              <a-form-model-item class="form-item mb-3" label="Имя" prop="name">
                <a-input v-model="form.name" placeholder="Имя..." />
              </a-form-model-item>
              <div class="permissions-container">
                <div class="permissions-header"><h5>Доступы к разделам</h5></div>
                <div
                  class="permissions-list"
                  v-for="permission in permissions"
                  :key="permission.id"
                >
                  <h4>{{ permission?.label }}</h4>
                  <span v-if="permission.type == 'single'">
                    <a-switch
                      @change="($event) => onChange($event, permission)"
                      :default-checked="
                        !!form.permissions.find((elem) => elem.id == permission.id)
                      "
                      :checked="
                        !!form.permissions.find((elem) => elem.id == permission.id)
                      "
                  /></span>
                  <span v-else class="permissions-checkbox-list">
                    <span class="permissions-checkbox">
                      Создание
                      <a-checkbox
                        :checked="
                          form.permissions
                            .find((elem) => elem.id == permission.id)
                            ?.actions.includes('post')
                        "
                        @change="onChangeCheckbox(permission, 'post')"
                      />
                    </span>
                    <span class="permissions-checkbox">
                      Редактирование
                      <a-checkbox
                        :checked="
                          form.permissions
                            .find((elem) => elem.id == permission.id)
                            ?.actions.includes('put')
                        "
                        @change="onChangeCheckbox(permission, 'put')"
                      />
                    </span>

                    <span class="permissions-checkbox">
                      Удаление
                      <a-checkbox
                        :checked="
                          form.permissions
                            .find((elem) => elem.id == permission.id)
                            ?.actions.includes('delete')
                        "
                        @change="onChangeCheckbox(permission, 'delete')"
                      />
                    </span>
                    <span class="permissions-checkbox">
                      Импорт
                      <a-checkbox
                        :checked="
                          form.permissions
                            .find((elem) => elem.id == permission.id)
                            ?.actions.includes('get')
                        "
                        @change="onChangeCheckbox(permission, 'get')"
                      />
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-form-model>
  </div>
</template>
<script>
import FormTitle from "../../../components/Form-title.vue";
import TitleBlock from "../../../components/Title-block.vue";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import status from "../../../mixins/status";
import authAccess from "../../../mixins/authAccess";

export default {
  mixins: [status, authAccess],
  head: {
    title: "Новости",
  },
  data() {
    return {
      formTab: "ru",
      formTabData: [
        {
          label: "Русский",
          index: "ru",
        },
        {
          label: "O'zbek",
          index: "uz",
        },
        {
          label: "English",
          index: "en",
        },
      ],
      rules: {
        name: [
          {
            required: true,
            message: "This field is required",
            trigger: "change",
          },
        ],
      },
      form: {
        name: "",
        permissions: [],
      },
      permissions: [],
      roleData: {},
    };
  },
  mounted() {
    this.__GET_PERMISSIONS();
    this.__GET_ROLE_BY_ID(this.$route.params.index);
  },
  methods: {
    onSubmit() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.__EDIT_ROLE(this.form);
        } else {
          return false;
        }
      });
    },
    async __GET_ROLE_BY_ID(id) {
      try {
        const data = await this.$store.dispatch("fetchRole/getRoleById", id);
        this.visible = true;
        this.roleData = data?.role;

        this.form = {
          name: data?.role?.name,
          permissions: data?.role?.permissions.map((item) => {
            return {
              id: item.id,
              actions: JSON.parse(item?.pivot?.actions),
            };
          }),
        };
      } catch (e) {
        this.statusFunc(e);
      }
    },
    onChange(e, obj) {
      let actions = [];
      if (e) {
        actions.push(obj.method);
        this.form.permissions.push({ id: obj.id, actions: actions });
      } else if (this.form.permissions.find((item) => item.id == obj.id)) {
        this.form.permissions = this.form.permissions.filter(
          (element) => element.id != obj.id
        );
      }
    },
    onChangeCheckbox(obj, type) {
      const elem = this.form.permissions.find((item) => item.id == obj.id);
      if (elem) {
        if (elem.actions.includes(type)) {
          elem.actions.splice(elem.actions.indexOf(type), 1);
          if (elem.actions.length == 0) {
            this.form.permissions = this.form.permissions.filter(
              (element) => element.id != obj.id
            );
          }
        } else {
          elem.actions.push(type);
        }
      } else {
        this.form.permissions.push({ id: obj.id, actions: [type] });
      }
    },
    async __GET_PERMISSIONS() {
      const data = await this.$store.dispatch("fetchRole/getPermissions");
      this.permissions = data?.permissions;
    },
    async __EDIT_ROLE(data) {
      try {
        await this.$store.dispatch("fetchRole/editRole", {
          id: this.$route.params.index,
          data: data,
        });
        this.$router.push("/settings/roles");
        this.notification("success", "success", "Успешно добавлен");
        this.$store.dispatch("getPermissions");
        // this.$store.commit("check");
      } catch (e) {
        this.statusFunc(e);
      }
    },
  },
  components: { TitleBlock, FormTitle },
};
</script>
<style lang="css">
.posts-grid {
  display: grid;
  grid-gap: 13px;
  grid-template-columns: 5fr 2fr;
}
.posts .ant-upload.ant-upload-select-picture-card,
.posts .ant-upload-list-picture-card .ant-upload-list-item,
.posts .ant-upload-list-picture-card-container {
  width: 100% !important;
  height: 150px !important;
}
.permissions-list {
  display: flex;
  justify-content: space-between;
  padding: 10px 13px 0 13px;
}
.permissions-list h4 {
  font-family: "Inter";
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 32px;
  color: #181c32;
}
.permissions-container {
  border: 1px solid #e4e6ef;
  border-radius: 6.175px;
  padding: 10px 0;
}
.permissions-header h5 {
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 32px;
  color: #181c32;
  padding: 0 13px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e6ef;
}
.permissions-checkbox {
  display: flex;
  flex-direction: column;
  font-family: "TT Interfaces";
  font-style: normal;
  letter-spacing: 1.3px;
  font-weight: 600;
  color: #b5b5c3;
  font-size: 11.7px;
  line-height: 32px;
  justify-content: center;
  text-align: center;
}
.permissions-checkbox .ant-checkbox-wrapper {
  display: flex;
  justify-content: center;
}
.permissions-checkbox-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
}
</style>
