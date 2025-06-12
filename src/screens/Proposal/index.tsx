import {type PropsWithChildren, ReactNode, useMemo, useRef} from 'react'
import {Pressable, StyleSheet, View} from 'react-native'
import Animated from 'react-native-reanimated'
import {Image} from 'expo-image'
import {moderatePost, RichText as RichTextAPI} from '@atproto/api'

import {
  type CommonNavigatorParams,
  type NativeStackScreenProps,
} from '#/lib/routes/types'
import {useModerationOpts} from '#/state/preferences/moderation-opts'
import {
  fillThreadModerationCache,
  ThreadModerationCache,
} from '#/state/queries/post-thread'
import {PostEmbeds, PostEmbedViewContext} from '#/view/com/util/post-embeds'
import * as Toast from '#/view/com/util/Toast'
import {atoms as a, useBreakpoints, useTheme} from '#/alf'
import {Button} from '#/components/Button'
import * as Layout from '#/components/Layout'
import * as Prompt from '#/components/Prompt'
import ProposalStatusTag, {ProposalStatus} from '#/components/ProposalStatusTag'
import {RichText} from '#/components/RichText'
import {Text} from '#/components/Typography'
import ProposalAuthor from './ProposalAuthor'
import ProposalEmbeds from './ProposalEmbeds'
import VoltConfirm, {type VoltConfirmRef} from './VoltConfirm'
const {Header} = Layout

type Props = NativeStackScreenProps<CommonNavigatorParams, 'ProposalDetail'>

export default function ProposalDetailScreen({route}: Props) {
  const {proposalId} = route.params
  const headerRef = useRef<View | null>(null)
  const {gtMobile} = useBreakpoints()
  const delControl = Prompt.usePromptControl()
  const voltConfirmRef = useRef<VoltConfirmRef>(null)
  const t = useTheme()
  const mockEmbed = {
    $type: 'app.bsky.embed.images#view',
    images: [
      {
        thumb:
          'https://bsky.rivtower.cc/img/feed_thumbnail/plain/did:plc:pc5gxd5my6uooild5drcixdm/bafkreigzzzfwbraggh4zfxws6qladwrpwvpihscaqigkgb5zusvi6zfixu@jpeg',
        fullsize:
          'https://bsky.rivtower.cc/img/feed_fullsize/plain/did:plc:pc5gxd5my6uooild5drcixdm/bafkreigzzzfwbraggh4zfxws6qladwrpwvpihscaqigkgb5zusvi6zfixu@jpeg',
        alt: '',
        aspectRatio: {width: 474, height: 474},
      },
      {
        thumb:
          'https://bsky.rivtower.cc/img/feed_thumbnail/plain/did:plc:pc5gxd5my6uooild5drcixdm/bafkreigzzzfwbraggh4zfxws6qladwrpwvpihscaqigkgb5zusvi6zfixu@jpeg',
        fullsize:
          'https://bsky.rivtower.cc/img/feed_fullsize/plain/did:plc:pc5gxd5my6uooild5drcixdm/bafkreigzzzfwbraggh4zfxws6qladwrpwvpihscaqigkgb5zusvi6zfixu@jpeg',
        alt: '',
        aspectRatio: {width: 474, height: 474},
      },
    ],
  }

  const mockAuthor = {
    avatar:
      'https://bsky.rivtower.cc/img/avatar/plain/did:plc:pc5gxd5my6uooild5drcixdm/bafkreibjmsjgiof6p5wt6h574xqixwmlvmigttg7ohuykruclanmvmkflq@jpeg',
    createdAt: '2025-06-03T05:34:27.189Z',
    did: 'did:plc:pc5gxd5my6uooild5drcixdm',
    displayName: '',
    handle: 'zhengzhou.web5.rivtower.cc',
    labels: [],
    viewer: {muted: false, blockedBy: false},
  }

  const canDelProposal = true
  // if(!propsosalDetail) return null;

  return (
    <Layout.Screen
      style={[styles.page, gtMobile && styles.maxPageWidth]}
      testID="proposalDetailScrren">
      {/* <PostThreadComponent uri={uri} /> */}
      <Header.Outer headerRef={headerRef}>
        <Header.BackButton />
        <Header.Content>
          <Header.TitleText>提案</Header.TitleText>
        </Header.Content>
        <Header.Slot>
          {canDelProposal && (
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                delControl.open()
              }}>
              <View style={[a.align_end]}>
                <Image
                  accessibilityIgnoresInvertColors
                  style={{width: 22, height: 22}}
                  source={require('#/assets/dustbin.svg')}
                />
              </View>
            </Pressable>
          )}
          {/* <ThreadMenu
            sortReplies={sortReplies}
            treeViewEnabled={treeViewEnabled}
            setSortReplies={updateSortReplies}
            setTreeViewEnabled={updateTreeViewEnabled}
            /> */}
        </Header.Slot>
      </Header.Outer>
      <View style={[styles.main]}>
        <View style={[a.px_lg, a.pt_lg]}>
          <ProposalAuthor author={mockAuthor} />
        </View>
        <View style={[a.px_lg, a.pt_md]}>
          <Text style={[a.text_xl, a.font_bold]}>提案名称</Text>
        </View>
        <View
          style={[
            a.flex_row,
            a.align_center,
            a.justify_between,
            a.my_md,
            a.px_lg,
          ]}>
          <ProposalStatusTag status={ProposalStatus.InProgress} />
          <View style={[a.flex_row, a.align_center, a.gap_xs]}>
            <Image
              accessibilityIgnoresInvertColors
              style={{width: 16, height: 16}}
              source={require('#/assets/clock.svg')}
            />
            <Text style={[a.text_xs, t.atoms.text_contrast_medium]}>
              0000/00/00 00:00
            </Text>
          </View>
        </View>
        <View style={[a.px_lg]}>
          <View style={[styles.spliter]} />
        </View>

        <Animated.ScrollView
          style={[a.flex_1, a.px_lg, a.pb_lg]}
          contentContainerStyle={a.flex_grow}>
          <View style={[styles.blockTitle]}>
            <Text style={[a.text_md]}>proposalId: {proposalId}</Text>
          </View>
          <View style={[styles.blockContent]}>
            <RichText
              enableTags
              selectable
              value={new RichTextAPI({text: '123'})}
              style={[a.flex_1, a.text_xl]}
              // authorHandle={post.author.handle}
              shouldProxyLinks={true}
            />
            <View style={[a.py_xs]}>
              <ProposalEmbeds embed={mockEmbed} />
            </View>
          </View>
          <View style={[styles.blockTitle]}>
            <Text style={[a.text_md]}>proposalId: {proposalId}</Text>
          </View>
          <View style={[styles.blockContent]}>
            <RichText
              enableTags
              selectable
              value={new RichTextAPI({text: '123'})}
              style={[a.flex_1, a.text_xl]}
              // authorHandle={post.author.handle}
              shouldProxyLinks={true}
            />
            <View style={[a.py_xs]}>
              <ProposalEmbeds embed={mockEmbed} />
            </View>
          </View>
          <View
            style={[
              {
                height: 2000,
                backgroundImage:
                  'linear-gradient(71deg, #DEF2FE 10.27%, #B5D3FF 28.82%, #D9D7FA 96.02%)',
              },
            ]}
          />
          <VoltResult agree={40} disagree={60} />
        </Animated.ScrollView>

        {true ? (
          <View
            style={[
              a.flex_row,
              a.align_center,
              a.px_lg,
              a.gap_sm,
              a.py_sm,
              styles.voltActionBorder,
            ]}>
            <SkewButton
              label="disagree"
              position="left"
              color="#FD615B"
              onPress={() => voltConfirmRef.current?.open('disagree')}>
              <Text style={[a.text_md, {color: '#fff'}]}>反对</Text>
            </SkewButton>
            <SkewButton
              label="agree"
              position="right"
              color="#1083FE"
              onPress={() => voltConfirmRef.current?.open('agree')}>
              <Text style={[a.text_md, {color: '#fff'}]}>同意</Text>
            </SkewButton>
          </View>
        ) : (
          <View style={{height: 32}} />
        )}
      </View>
      <Prompt.Basic
        control={delControl}
        title="要删除这则贴文吗？"
        description="如果你删除这则贴文，则以后将无法恢复。"
        confirmButtonCta="删除"
        onConfirm={() => {
          debugger
        }}
        confirmButtonColor="negative"
      />

      <VoltConfirm
        ref={voltConfirmRef}
        onConfirm={async voltFor => {
          console.log('goingt to volt', voltFor)
          Toast.show('投票成功', 'check', 'center')
          // Toast.show('报错', 'xmark');
        }}
      />
    </Layout.Screen>
  )
}

type SkewButtonProps = {
  label: string
  position: 'left' | 'right'
  color: string
  onPress: () => void
}

function SkewButton({
  label,
  position,
  color,
  children,
  onPress,
}: PropsWithChildren<SkewButtonProps>) {
  return (
    <Button label={label} style={[styles.skewButton]} onPress={onPress}>
      <View style={[a.h_full, a.w_full]}>
        <View
          style={[
            styles.skewButtonBGRounded,
            {
              [position === 'left' ? 'left' : 'right']: 0,
              backgroundColor: color,
            },
          ]}
        />
        <View
          style={[
            styles.skewButtonBGSkew,
            {
              [position === 'left' ? 'right' : 'left']: 0,
              backgroundColor: color,
            },
          ]}
        />
        <View style={[a.h_full, a.align_center, a.justify_center]}>
          {children}
        </View>
      </View>
    </Button>
  )
}

type VoltResultProps = {
  agree: number | undefined
  disagree: number | undefined
}

function VoltResult(props: VoltResultProps) {
  const {agree: unsafe_agree, disagree: unsafe_disagree} = props
  const t = useTheme()
  const {agreeVal, disagreeVal, agreePercent, disagreePercent} = useMemo(() => {
    const agree = unsafe_agree || 0
    const disagree = unsafe_disagree || 0
    const sum = agree + disagree
    if (sum === 0) {
      return {
        agreeVal: 0,
        disagreeVal: 0,
        agreePercent: '0%' as `${number}%`,
        disagreePercent: '0%' as `${number}%`,
      }
    }
    // const agreePercentVal = (agree / sum * 100).toFixed(0);
    return {
      agreeVal: agree,
      disagreeVal: disagree,
      agreePercent: `${((agree / sum) * 100).toFixed(0)}%` as `${number}%`,
      disagreePercent: `${((disagree / sum) * 100).toFixed(
        0,
      )}%` as `${number}%`,
    }
  }, [unsafe_agree, unsafe_disagree])
  return (
    <View style={[a.mb_2xl, a.mt_lg]}>
      <View style={[styles.spliter, a.mb_md]} />
      <View style={[a.flex_row, a.align_center, a.justify_between, a.py_xs]}>
        <View>
          <Text style={[a.text_sm, a.font_bold]}>
            总投票数: {agreeVal + disagreeVal}
          </Text>
        </View>
        <Text style={[a.text_xs, t.atoms.text_contrast_medium]}>
          截止时间: 0000/00/00 00:00:00
        </Text>
        <Text style={[a.text_xs, a.font_bold, {color: '#FD615B'}]}>已结束</Text>
      </View>
      <View style={[a.mt_sm, voltStyles.border, a.p_lg]}>
        <View style={[a.mb_md]}>
          <Text style={[a.text_xs, t.atoms.text_contrast_low]}>
            你已选: 同意/不同意
          </Text>
        </View>
        <View style={[a.flex_row, a.align_center, a.gap_md, a.pb_md]}>
          <Text>同意</Text>
          <View style={voltStyles.bar}>
            <View
              style={[
                voltStyles.barInner,
                {backgroundColor: '#1083FE', width: agreePercent},
              ]}
            />
          </View>
          <View>
            <Text>{agreeVal}</Text>
          </View>
          <View>
            <Text>({agreePercent})</Text>
          </View>
        </View>
        <View style={[a.flex_row, a.align_center, a.gap_md]}>
          <Text>反对</Text>
          <View style={voltStyles.bar}>
            <View
              style={[
                voltStyles.barInner,
                {backgroundColor: '#FD615B', width: disagreePercent},
              ]}
            />
          </View>
          <View>
            <Text>{disagreeVal}</Text>
          </View>
          <View>
            <Text>({disagreePercent})</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    height: '100%',
    width: '100%',
  },
  maxPageWidth: {
    maxWidth: 600,
    alignSelf: 'center',
  },
  main: {
    height: 'calc(100% - 52px - 58px)',
  },
  blockTitle: {
    marginTop: 16,
    padding: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(16, 131, 254, 0.1)',
  },
  blockContent: {
    marginTop: 16,
  },
  spliter: {
    height: 1,
    width: '100%',
    backgroundColor: '#D4DBE2',
  },
  voltButtonReject: {
    flex: 1,
    backgroundColor: '#FD615B',
    transform: 'skewX(-30deg) translateX(4px)',
    borderRadius: 10,
    width: '100%',
    // borderTopLeftRadius: 44,
    // borderBottomLeftRadius: 44,
    // borderTopRightRadius: 6,
    // borderBottomRightRadius: 100,
    height: 44,
  },
  voltButtonAgree: {
    flex: 1,
    backgroundColor: '#1083FE',
    transform: 'skewX(-30deg)  translateX(-4px)',
  },
  skewButton: {
    position: 'relative',
    height: 44,
    flex: 1,
  },
  skewButtonBGRounded: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '50%',
    borderRadius: 44,
    height: 44,
    flex: 1,
  },
  skewButtonBGSkew: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 10,
    width: '80%',
    height: 44,
    transform: 'skewX(-30deg)  translateX(-4px)',
  },
  voltActionBorder: {
    borderTopColor: '#D4DBE2',
    borderTopWidth: 0.5,
    borderStyle: 'solid',
  },
})

const voltStyles = StyleSheet.create({
  border: {
    borderWidth: 0.5,
    borderColor: '#d4dbe2',
    borderRadius: 12,
  },
  bar: {
    flex: 1,
    height: 10,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#F1F3F5',
  },
  barInner: {
    height: '100%',
  },
  value: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0,
    flexBasis: 20,
    // width: 200,
  },
  percent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0,
    flexBasis: 40,
  },
})
