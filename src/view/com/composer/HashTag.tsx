import {Pressable,StyleSheet, View} from 'react-native'

import {Text} from '#/components/Typography'

const HashTag = (props: {
  active?: string
  setHashTag: (hashTag: string) => void
}) => {
  const {setHashTag, active = ''} = props

  return (
    <View style={styles.wrap}>
      <Text style={styles.header}>请选择类型:</Text>
      <View style={styles.container}>
        {['#任务', '#商品', '#活动'].map(tag => {
          const isActive = tag === active

          return (
            <Pressable
              key={tag}
              accessibilityRole={'button'}
              style={[styles.button, isActive && styles.button_active]}
              onPress={() => {
                setHashTag(tag)
              }}>
              <Text
                style={[
                  styles.button_text,
                  isActive && styles.button_active_text,
                ]}>
                {tag}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

export default HashTag

const styles = StyleSheet.create({
  wrap: {
    paddingBlock: 13,
    paddingInline: 16,
  },
  header: {
    color: '#6F869F',
    fontSize: 14,
    lineHeight: 18,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 7,
  },
  button: {
    paddingBlock: 7,
    paddingInline: 10,
    borderRadius: 6,
    backgroundColor: '#F1F3F5',
  },
  button_active: {
    backgroundColor: '#1083FE',
  },
  button_active_text: {
    color: '#fff',
  },
  button_text: {
    color: '#42576C',
    fontSize: 14,
    lineHeight: 18,
  },
})
