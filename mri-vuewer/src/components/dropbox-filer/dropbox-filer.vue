<template>
  <v-card :max-width="MaxWidth">
    <v-card-title>
      収録データ
      <div class="flex-grow-1"></div>
      <v-text-field
        v-model="search"
        append-icon="mdi-file-document-box-search"
        label="Search"
      />
    </v-card-title>
    <v-data-table
      show-expand
      single-expand
      :expanded.sync="expanded"
      :headers="ui.headers"
      :items="items"
      :items-per-page="-1"
    >
      <template v-slot:item.day="{ item }">
        {{ item.day | moment }}
      </template>
      <template v-slot:item.sex="{ item }">
        {{ item.sex | sex }}
      </template>
      <template v-slot:item.language="{ item }">
        {{ item.language | lang }}
      </template>
      <template v-slot:item.dialect="{ item }">
        {{ item.dialect | dialect }}
      </template>
      <template v-slot:expanded-item="{ item, headers }">
        <td :colspan="headers.length" class="ma-0 pa-0">
          <dropbox-file-list :url="item.path" />
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import DFILES from "@/api/dfiles";
import DropboxFileList from "@/components/dropbox-filer/dropbox-file-list.vue";
import FILTER from "@/filters/file-filter.js";
export default {
  components: {
    DropboxFileList
  },
  props: {
    MaxWidth: {
      type: String
    }
  },
  data: () => ({
    search: "",
    expanded: [],
    ui: DFILES.ui
  }),
  filters: FILTER,
  computed: {
    items: function() {
      if (this.search) {
        const searches = this.search.split(/[\x20\u3000]/);
        const query = [];
        for (const text of searches) {
          if (text) {
            const dialect = FILTER.reverse.dialect(text);
            const lang = FILTER.reverse.lang(text);
            const sex = FILTER.reverse.sex(text);
            if (dialect) {
              query.push(dialect);
            } else if (lang) {
              query.push(lang);
            } else if (sex) {
              query.push(sex);
            } else {
              query.push(text);
            }
          }
        }
        if (query.length > 0) {
          const _query = query.filter((x, index, self) => {
            return self.indexOf(x) === index;
          });
          console.info(_query);
          return DFILES.dirs.filter(x => {
            const x_values = Object.values(x);
            let check = 0;
            for (const q of _query) {
              if (x_values.indexOf(q) >= 0) {
                check += 1;
              }
            }
            return check === query.length;
          });
        }
      }
      return DFILES.dirs;
    }
  }
};
</script>

<style scoped></style>
