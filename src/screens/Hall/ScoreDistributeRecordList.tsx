import {useRef} from 'react'
import {Pressable, StyleSheet, View} from 'react-native'
import {Image} from 'expo-image'
import {useNavigation} from '@react-navigation/native'
import {useInfiniteScroll} from 'ahooks'
import {format, parseISO} from 'date-fns'

import displayNumber from '#/lib/displayNumber'
import {type NavigationProp} from '#/lib/routes/types'
import {atoms as a, useTheme} from '#/alf'
import * as Layout from '#/components/Layout'
import {Text} from '#/components/Typography'
import server from '#/server'

type InfiniteScrollType = {
  list: APIDao.WebEndpointsScoreScoreDistributeRecordPageVo[]
  total: number
  curPage: number
}

const PAGE_SIZE = 30

export default function HallScoreDistributeRecordListScreen() {
  const t = useTheme()
  const navigation = useNavigation<NavigationProp>()
  const ref = useRef(null)

  const getRecords = async (page: number, d?: InfiniteScrollType) => {
    const result = await server.dao('POST /score-distribute-record/page', {
      pageNum: page,
      pageSize: PAGE_SIZE,
    })

    return {
      list: (d?.list || []).concat(result?.items || []),
      total: result?.total || 0,
      curPage: (result?.pageIndex || 0) + 1,
    }
  }

  const {
    data: recordsData,
    loading,
    loadingMore,
  } = useInfiniteScroll<InfiniteScrollType>(
    async d => {
      const page = d ? d.curPage + 1 : 1
      return await getRecords(page, d)
    },
    {
      target: ref,
      isNoMore: d => d?.list?.length === d?.total,
    },
  )

  return (
    <Layout.Screen testID="HallScoreDistributeRecordList">
      <Layout.Center style={{flex: 1}}>
        <Pressable
          accessibilityRole="button"
          accessibilityIgnoresInvertColors
          style={{position: 'absolute', left: 16, top: 18, zIndex: 1}}
          onPress={() =>
            !navigation.canGoBack()
              ? navigation.push('Hall')
              : navigation.goBack()
          }>
          <Image
            accessibilityIgnoresInvertColors
            style={{width: 14, height: 12}}
            source={require('#/assets/arrow-left.svg')}
          />
        </Pressable>
        <View style={[styles.headContainer, a.pb_4xl]}>
          <View style={styles.linearBg}>
            <View style={styles.headImage}>
              <Image
                accessibilityIgnoresInvertColors
                style={{width: 224, height: 224}}
                source={require('#/assets/hall/node-list.bg.png')}
              />
            </View>
          </View>
          <View style={[styles.headPlaceholder, a.mb_lg]} />
          <View style={[a.px_lg]}>
            <Text style={[t.atoms.text, a.text_2xl, a.font_bold]}>
              稻米发放记录
            </Text>
          </View>
          <View style={[a.px_lg, a.mt_md]}>
            <Text style={[t.atoms.text_contrast_low, a.text_sm]}>
              查看节点获取稻米记录
            </Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={[styles.cardContent, a.overflow_auto]} ref={ref}>
            {loading && !recordsData?.list?.length ? (
              <View style={[a.w_full, a.align_center, a.py_4xl]}>
                <Text style={[a.text_md, t.atoms.text_contrast_low]}>
                  加载中...
                </Text>
              </View>
            ) : recordsData?.list?.length ? (
              recordsData.list.map((record, index) => (
                <View
                  key={`${record.userId}-${record.getTime}-${index}`}
                  style={[
                    a.flex_row,
                    a.justify_between,
                    a.px_lg,
                    a.align_center,
                    styles.item,
                  ]}>
                  <View style={[a.flex_col, a.justify_between, a.gap_sm]}>
                    <Text style={[a.text_md, a.font_bold, t.atoms.text]}>
                      {record.domainName || record.userId}
                    </Text>
                    <Text style={[t.atoms.text_contrast_low]}>
                      {format(parseISO(record.getTime), 'yyyy-MM-dd HH:mm:ss')}
                    </Text>
                  </View>
                  <Text
                    style={[
                      a.text_md,
                      a.text_family_ddin,
                      a.font_bold,
                      styles.score,
                    ]}>
                    +{displayNumber(record.score)}
                  </Text>
                </View>
              ))
            ) : (
              <View style={[a.w_full, a.align_center, a.py_4xl]}>
                <Text style={[a.text_md, t.atoms.text_contrast_low]}>
                  暂无发放记录
                </Text>
              </View>
            )}
            {loadingMore ? (
              <View style={[a.w_full, a.align_center, a.py_lg]}>
                <Text style={[a.text_sm, t.atoms.text_contrast_low]}>
                  加载更多中...
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </Layout.Center>
    </Layout.Screen>
  )
}

const styles = StyleSheet.create({
  headContainer: {
    position: 'relative',
  },
  headImage: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  linearBg: {
    position: 'absolute',
    zIndex: 0,
    width: '100%',
    paddingBottom: '66.5%',
    opacity: 0.6,
    backgroundColor: '#DEF2FE',
  },
  headPlaceholder: {
    height: 52,
  },
  card: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#fff',
    backgroundColor: '#F3F9FE',
    paddingBlock: 18,
    paddingInline: 16,
  },
  cardContent: {
    height: '100%',
  },
  item: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 12,
    paddingBlock: 10,
  },
  score: {
    color: '#F66455',
  },
})
