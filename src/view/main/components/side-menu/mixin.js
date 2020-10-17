import CommonIcon from '_c/common-icon'

export default {
  components: {
    CommonIcon
  },
  data () {
    return {
      approve_count: '', complaint_count: '', feedback_count: '', photo_count: '', nocommorder_count: '', nocommuser_count: ''
    }
  },
  methods: {
    showNotices (item, notices) {
      // console.log(item, '123456789')
      // console.log(notices, '987654321')
      switch (item.name) {
        case 'authentication':
          return notices.approve_count
          break
        case 'complain':
          return notices.complaint_count
          break
        case 'feedbacks':
          return notices.feedback_count
          break
        case 'auditPhoto':
          return notices.photo_count
          break
        case 'userlist':
          return notices.nocommuser_count
          break
        case 'orders':
          return notices.nocommorder_count
          break
        default:
          return
          break
      }
    },
    showTitle (item) {
      return this.$config.useI18n ? this.$t(item.name) : ((item.meta && item.meta.title) || item.name)
    },
    showChildren (item) {
      return item.children && (item.children.length > 1 || (item.meta && item.meta.showAlways))
    },
    getNameOrHref (item, children0) {
      return item.href ? `isTurnByHref_${item.href}` : (children0 ? item.children[0].name : item.name)
    }
  },
  mounted () {
  }
}
