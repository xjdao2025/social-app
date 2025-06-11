import { Text } from "#/components/Typography";
import SubBar from "#/screens/Profile/Tabs/SubBar";
import { type FeedSectionProps, ProfileFeedSection } from "#/screens/Profile/Sections/Feed";
import { type AppBskyActorDefs } from "@atproto/api";
import React, { Ref, useEffect } from "react";
import { type SectionRef } from "#/screens/Profile/Sections/types";
import { type ListRef } from '#/view/com/util/List'
import * as Layout from '#/components/Layout'

type ProfileTabsAllProps = {
  profile: AppBskyActorDefs.ProfileViewDetailed
  sectionRef: Ref<SectionRef>
} & Pick<FeedSectionProps, 'headerHeight' | 'isFocused' | 'scrollElRef' | 'setScrollViewTag'>

export function ProfileTabsAll(props: ProfileTabsAllProps) {
  const {
    profile,
    headerHeight,
    isFocused,
    scrollElRef,
    setScrollViewTag,
    sectionRef
  } = props;

  return <Layout.Center>
    <SubBar
      items={[{ key: 'all', label: '贴文' }, { key: 'post', label: '回复' }]}
    />
    <ProfileFeedSection
      ref={sectionRef}
      feed={`author|${profile.did}|posts_and_author_threads`}
      headerHeight={headerHeight}
      isFocused={isFocused}
      scrollElRef={scrollElRef as ListRef}
      ignoreFilterFor={profile.did}
      setScrollViewTag={setScrollViewTag}
    />
  </Layout.Center>
}