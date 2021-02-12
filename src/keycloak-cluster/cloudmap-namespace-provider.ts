import * as ec2 from '@aws-cdk/aws-ec2';
import * as servicediscovery from '@aws-cdk/aws-servicediscovery';
import * as cdk from '@aws-cdk/core';

/**
 * Provides CloudMapNamespaceInfo once the VPC is available.
 */
export interface ICloudMapNamespaceInfoProvider {
  /**
   * Binds resources to the parent scope with the VPC and provides
   * CloudMapNamespaceInfo
   */
  bind(scope: cdk.Construct, vpc: ec2.IVpc): CloudMapNamespaceInfo;
}

/**
 * Information about the CloudMap namespace for service discovery.
 */
export interface CloudMapNamespaceInfo {
  /**
   * The CloudMap namespace to use for service discovery.
   */
  readonly cloudMapNamespace: servicediscovery.INamespace;
}

/**
 * Props for creating a private Dns Namespace.
 */
export interface PrivateDnsNamespaceProviderProps {
  /**
   * The globally unique name for the namespace.
   * @default 'keycloak-service-discovery'
   */
  readonly name?: string;
}

/**
 * A convenience interface for creating a CloudMap namespace.
 */
export abstract class CloudMapNamespaceProvider {
  /**
   * Create a CloudMap namespaces from a private dns zone.
   */
  static privateDns(props?: PrivateDnsNamespaceProviderProps): ICloudMapNamespaceInfoProvider {
    return {
      bind(scope: cdk.Construct, vpc: ec2.IVpc): CloudMapNamespaceInfo {
        return {
          cloudMapNamespace: new servicediscovery.PrivateDnsNamespace(scope, 'ServiceDiscoveryNS', {
            name: props?.name ?? 'keycloak-service-discovery',
            vpc: vpc,
          }),
        };
      },
    };
  }
}