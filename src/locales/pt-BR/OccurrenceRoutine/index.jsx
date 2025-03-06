import Assets from './Assets/index'
import AttendanceAndOccurrence from './AttendanceAndOccurrence/index'
import AttendanceChannel from './AttendanceChannel/index'
import AttendanceClassification from './AttendanceClassification/index'
import CheckInCheckOut from './CheckInCheckOut/index'
import Priority from './Priority/index'
import StatusAndReason from './StatusAndReason/index'

export default {
  ...Priority,
  ...AttendanceChannel,
  ...AttendanceClassification,
  ...StatusAndReason,
  ...Assets,
  ...CheckInCheckOut,
  ...AttendanceAndOccurrence,
}
